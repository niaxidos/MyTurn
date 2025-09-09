import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Info from "./components/Info";
import Overview from "./components/Overview";
import Result from "./components/Result";
import "./App.css";
import Popup from './components/Popup';
import Marquee from 'react-fast-marquee';
 
function App() {
  const navigate = useNavigate();

  // Microphone recording state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef();

  // Start recording
  const startRecording = async () => {
    setAudioURL(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied or not supported.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Upload audio
  const uploadAudio = async () => {
    if (!audioBlob) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    try {
      const res = await fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        body: formData,
      });
      let data;
      if (res.headers.get('content-type')?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      setResultData(data);
      setLoading(false);
      navigate('/result');
    } catch (err) {
      setResultData({ error: err.message });
      setLoading(false);
      navigate('/result');
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Upload file (from drag/drop or input)
  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', file, 'recording.wav');
    try {
      const res = await fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        body: formData,
      });
      let data;
      if (res.headers.get('content-type')?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      setResultData(data);
      setLoading(false);
      navigate('/result');
    } catch (err) {
      setResultData({ error: err.message });
      setLoading(false);
      navigate('/result');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2 className="loading-text">Processing audio, please wait...</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="tailwind-test">Tailwind Test</div>
      <Navbar />
      {window.location.pathname === '/' && <Popup />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Marquee
                pauseOnHover
                speed={100}
                gradient
                gradientWidth={120}
                gradientColor="#1f1740"
                className="marquee"
              >
                <span className="marquee-text">
                  Turning up the <span className="marquee-voices">voices</span> that go
                  <span className="marquee-unheard">unheard</span>
                </span>
              </Marquee>
              <div className="content-wrapper">
                <div className="mic-record">
                  <p className="mic-title">🎙️ Record with Mic</p>
                  {!recording && (
                    <button
                      onClick={startRecording}
                      className="mic-btn"
                    >
                      Start Recording
                    </button>
                  )}
                  {recording && (
                    <button
                      onClick={stopRecording}
                      className="mic-btn mic-btn-stop"
                    >
                      Stop Recording
                    </button>
                  )}
                  {audioURL && (
                    <div className="mic-upload">
                      <audio src={audioURL} controls className="mic-audio" />
                      <br />
                      <button
                        onClick={uploadAudio}
                        className="mic-upload-btn"
                      >
                        Upload & Transcribe
                      </button>
                    </div>
                  )}
                </div>
                <div className="drag-drop">
                  <p className="drag-title">📤 Drag & Drop Upload</p>
                  <input
                    type="file"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    className="drag-drop-box"
                  >
                    Click or drag & drop an audio file here
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route path="/info" element={<Info />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/result" element={<Result data={resultData} />} />
      </Routes>
      <footer className="footer">© 2025 MyTurn. All rights reserved.</footer>
    </div>
  );
}

export default App;
