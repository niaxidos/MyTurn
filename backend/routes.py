'''
We used model.h , which was trained from a model found in this link:
https://github.com/x4nth055/gender-recognition-by-voice

Thank you for allowing us to use this code for our product.
'''


from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import json

import os
from dotenv import load_dotenv
import whisperx

from datetime import timedelta

import pyaudio
import wave
import librosa
import numpy as np
from sys import byteorder
from array import array
from struct import pack

from pydub import AudioSegment

# Load token
load_dotenv()
wits_token = os.getenv("TOKEN")


# Can change these to make WhisperX mdoel more accurate but it will take too much time. 
device = "cpu"
batch_size = 8
compute_type = "int8"
type = "tiny"   # Can be:
                # tiny, base, medium, large. 
                # Each one takes longer than the last but is more accurate.


def extract_feature(file_name, **kwargs):
    """
    Extract feature from audio file `file_name`
        Features supported:
            - MFCC (mfcc)
            - Chroma (chroma)
            - MEL Spectrogram Frequency (mel)
            - Contrast (contrast)
            - Tonnetz (tonnetz)
        e.g:
        `features = extract_feature(path, mel=True, mfcc=True)`
    """
    mfcc = kwargs.get("mfcc")
    chroma = kwargs.get("chroma")
    mel = kwargs.get("mel")
    contrast = kwargs.get("contrast")
    tonnetz = kwargs.get("tonnetz")
    X, sample_rate = librosa.core.load(file_name)
    if chroma or contrast:
        stft = np.abs(librosa.stft(X))
    result = np.array([])
    if mfcc:
        mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
        result = np.hstack((result, mfccs))
    if chroma:
        chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
        result = np.hstack((result, chroma))
    if mel:
        mel = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T,axis=0)
        result = np.hstack((result, mel))
    if contrast:
        contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)
        result = np.hstack((result, contrast))
    if tonnetz:
        tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X), sr=sample_rate).T,axis=0)
        result = np.hstack((result, tonnetz))
    return result



def load_model(audio_file):
    model = whisperx.load_model(type, device, compute_type=compute_type)
    audio = whisperx.load_audio(audio_file)
    result = model.transcribe(audio, batch_size=batch_size)

    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
    result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

    diarize_model = whisperx.diarize.DiarizationPipeline(use_auth_token=wits_token, device=device)

    diarize_segments = diarize_model(audio)

    result = whisperx.assign_word_speakers(diarize_segments, result)

    return result

def transcribe_file(audio_file):
    from utils import create_model

    audio = AudioSegment.from_file(audio_file)

    # construct the model
    model = create_model()
    # load the saved/trained weights using an absolute path
    model_path = os.path.join(os.path.dirname(__file__), "model.h5")
    model.load_weights(model_path)
    # extract features and reshape it
    features = extract_feature(audio_file, mel=True).reshape(1, -1)

    
    result = load_model(audio_file)
    transcript = ""
    total_num_chunks = len(result["segments"])
    f_chunks = 0
    f_sec = 0.0
    m_chunks = 0
    m_sec = 0.0
    segments = result["segments"]
    transcript_text = []
    with open(audio_file.split(".")[0]+".txt", "w") as f:
        for i, segment in enumerate(segments):
            start_ms = int(segment["start"] * 1000)  # Convert seconds to milliseconds
            end_ms = int(segment["end"] * 1000)      # Convert seconds to milliseconds
            chunk = audio[start_ms:end_ms]           # Slice the audio

            start_time = timedelta(seconds=int(segment["start"]))
            end_time = timedelta(seconds=int(segment["end"]))
            speaker = segment.get("speaker", "UNKNOWN")
            text = segment.get("text", "").strip()
            os.makedirs("chunks", exist_ok=True)
            chunk_file = f"chunks/chunk_{i}.wav"
            chunk.export(chunk_file, format="wav")  # Save the chunk as a separate file
            print(f"Chunk {i}: {segment['text']}")   # Print the transcribed text for the chunk

            # extract features and reshape it
            features = extract_feature(chunk_file, mel=True).reshape(1, -1)
            # predict the gender!
            male_prob = model.predict(features)[0][0]
            female_prob = 1 - male_prob
            if male_prob > female_prob:
                gender = "male"
                m_chunks += 1
                m_sec += (segment["end"] - segment["start"])
            else:
                gender = "female"
                f_chunks += 1
                f_sec += (segment["end"] - segment["start"])
            # show the result!
            print("Result:", gender)
            print(f"Probabilities:     Male: {male_prob*100:.2f}%    Female: {female_prob*100:.2f}%")
            text = f"[{start_time}-{end_time}] ({speaker}: {gender}): {text}"
            f.write(text)
            print(text)
            transcript_text.append(text)
            transcript += segment.get("text", "").strip() + " "

    speech_length = m_sec + f_sec
    print(f"total num chunks: {total_num_chunks}")
    print(f"total female chunks: {f_chunks}")
    print(f"total female speech time: {f_sec:.2f} seconds")
    print(f"total male chunks: {m_chunks}")
    print(f"total male speech time: {m_sec:.2f} seconds")

    print(f"ratio female speech: {f_sec/speech_length:.2f}")
    print(f"ratio male speech: {m_sec/speech_length:.2f}")
    # return transcript
    information: dict = {
            "female_ratio": f_sec/speech_length,
            "male_ratio": m_sec/speech_length,
            "female_seconds": f"{f_sec:.1f}",
            "male_seconds": f"{m_sec:.1f}",
            "total_seconds": f"{speech_length:.1f}",
            "transcript": transcript_text,
    }

    return information


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/process', methods=["POST"])
def process_audio():
    print("Received request")  # Confirm request arrives
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    
    # save_path = "uploads/Equal.wav"
    audio_file.save(save_path)
    logging.info(f"Audio file saved to {save_path}")

    # Transcribe the saved file
    try:
        transcript: dict = transcribe_file(save_path)
        # Ensure transcript includes a genders array for each line
    except Exception as e:
        logging.error(f"Transcription failed: {e}")
        return jsonify({"error": "Transcription failed"}), 500

    # transcript: dict = transcribe_file(save_path)
    # logging.info(f"Transcription completed for {save_path}")

    # return jsonify({"status": "ok", "transcribed": transcript})
    return jsonify(transcript)
    
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)


# import os
# import logging
# from transcriber import transcribe_file

# # Set up logging
# logging.basicConfig(level=logging.INFO)

# # Define the file path
# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# file_path = os.path.join(UPLOAD_FOLDER, "ManMore.wav")

# # Check if the file exists
# if not os.path.exists(file_path):
#     logging.error(f"File {file_path} does not exist.")
# else:
#     # Transcribe the file
#     logging.info(f"Processing file: {file_path}")
#     transcript = transcribe_file(file_path)
#     logging.info(f"Transcription completed for {file_path}")
#     print(f"Transcribed text: {transcript}")






