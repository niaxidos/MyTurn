### Welcome

## MyTurn AI Transcriber and Gender Recognition Software
# Collaborators: Malk Daboor, Iris Bar, Julia Pham, Samiah Hossain, Nia Xidos

## Steps
1. Create virtual environment in root directory. 
Linux/MacOS: `python3 -m venv venvname`. 
Windows: `python -m venv venvname`
2. Run the virtual environment. 
Linux/MacOS: `source venvname/bin/activate`.
Windows: `venvname/Scripts/Activate`.
3. Download dependencies from requirements.txt by doing: `pip install -r requirements.txt`
4. run `npm i` to make sure you have all dependencies downloaded
5. run `npm start`/ `npm run dev`
6. run `routes.py`. 
7. Choose the type of audio you want, whether recorded or uploaded. 
8. Wait until processing is complete. Once that happens, you will see the distribution of the genders based on time, amount and the transcription. 



# Gender Recognition using Voice
This repository is about building a deep learning model using TensorFlow 2 to recognize gender of a given speaker's audio. Read this [tutorial](https://www.thepythoncode.com/article/gender-recognition-by-voice-using-tensorflow-in-python) for more information.

## Requirements
- TensorFlow 2.x.x
- Scikit-learn
- Numpy
- Pandas
- PyAudio
- Librosa
- ffmpeg

## Dataset used

[Mozilla's Common Voice](https://www.kaggle.com/mozillaorg/common-voice) large dataset is used here, and some preprocessing has been performed:
- Filtered out invalid samples.
- Filtered only the samples that are labeled in `genre` field.
- Balanced the dataset so that number of female samples are equal to male.
- Used [Mel Spectrogram](https://librosa.github.io/librosa/generated/librosa.feature.melspectrogram.html) feature extraction technique to get a vector of a fixed length from each voice sample, the [data](data/) folder contain only the features and not the actual mp3 samples (the dataset is too large, about 13GB).