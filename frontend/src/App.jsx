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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1f1740]">
        <div className="loader mb-4"></div>
        <h2 className="text-2xl text-[#a678ff] font-bold">Processing audio, please wait...</h2>
        <style>{`
          .loader {
            border: 8px solid #2d2360;
            border-top: 8px solid #a678ff;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page_wrapper" style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <div className="bg-red-500 text-white p-4">Tailwind Test</div>
      <Navbar />
      {/* Only show Popup on home page */}
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
                className="pt-4 pb-3"
              >
                <span className="flex items-center gap-2 text-5xl font-bold text-white drop-shadow-lg">
                  Turning up the <span className="text-[#a678ff] font-extrabold animate-pulse">voices</span> that go<span className="italic text-blue-300 align-bottom">unheard</span>
                </span>
              </Marquee>
              <div className="content_wrapper">
                <div className="mic_record bg-[#2c2153] rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 border-l-4 border-[#a678ff]">
                  <p className="text-2xl font-bold text-[#a678ff] mb-2">🎙️ Record with Mic</p>
                  {!recording && (
                    <button
                      onClick={startRecording}
                      className="bg-[#a678ff] hover:bg-[#7c4dff] text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200 text-lg"
                    >
                      Start Recording
                    </button>
                  )}
                  {recording && (
                    <button
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200 text-lg"
                    >
                      Stop Recording
                    </button>
                  )}
                  {audioURL && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <audio src={audioURL} controls className="w-48" />
                      <button
                        onClick={uploadAudio}
                        className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 text-base"
                      >
                        Upload & Transcribe
                      </button>
                    </div>
                  )}
                </div>
                <div className="drag_drop bg-[#2c2153] rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 border-l-4 border-[#a678ff]">
                  <p className="text-2xl font-bold text-[#a678ff] mb-2">📤 Drag & Drop Upload</p>
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
                    className="border-2 border-dashed border-[#a678ff] p-8 rounded-lg cursor-pointer bg-[#1f1740] text-[#a678ff] text-lg text-center w-64 hover:bg-[#251a3a] transition-colors duration-200"
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
      <footer>© 2025 MyTurn. All rights reserved.</footer>
    </div>
  );
}

export default App;
