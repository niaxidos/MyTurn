import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../Result.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Result = ({ data }) => {
  if (!data) return <p>No data available. Please send some.</p>;
  if (data.error) return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#1f1740' }}>
      <h1 className="text-3xl font-bold text-red-400 mb-4">Error</h1>
      <p className="text-lg text-white bg-red-700 p-4 rounded-lg shadow">{data.error}</p>
    </div>
  );
  const transcriptItems = []
  for (let i = 0; i < data.transcript.length; i++) {
    transcriptItems.push(<p key={i}>{data.transcript[i]}</p>)
  }

  // Example seconds (replace with real data as needed)
  const secondsFemale = data.female_seconds;
  const secondsMale = data.male_seconds;
  const totalSeconds = data.total_seconds;


  const averageMalePercentage = (data.male_ratio * 100).toFixed(2);
  const averageFemalePercentage = (data.female_ratio * 100).toFixed(2);
  
  const pieData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [averageMalePercentage, averageFemalePercentage],
        backgroundColor: [
          '#4FC3F7', // blue for male
          '#81C784', // green for female
        ],
        borderColor: ['#4FC3F7', '#81C784'],
        borderWidth: 1,
      },
    ],
  };

  const transcript = data.transcript.map((line, idx) => ({
    text: line,
    gender: data.genders?.[idx] || "unknown",
  }));  

    return (
    <div className="result-root">
      <h1 className="result-title">Result</h1>
      <div className="result-grid">
        <div className="result-tile">
          <h2 className="result-tile-title">Speaking %</h2>
          <div style={{ width: '8rem', height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pie
              data={pieData}
              options={{ cutout: '70%', maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="result-tile">
          <h2 className="result-tile-title">Speaking Time (seconds)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <span className="result-speaking">Female: {secondsFemale} seconds</span>
            <span className="result-speaking result-speaking-male">Male: {secondsMale} seconds</span>
            <span className="result-speaking result-speaking-total">Total: {totalSeconds} seconds</span>
          </div>
        </div>
        <div className="result-tile" style={{ gridColumn: 'span 2' }}>
          <h2 className="result-tile-title">Transcript</h2>
          <div className="result-transcript">
            {transcript.map((line, idx) => (
              <div
                key={idx}
                className={
                  "result-transcript-line " +
                  (line.gender === 'female'
                    ? 'result-transcript-female'
                    : line.gender === 'male'
                    ? 'result-transcript-male'
                    : 'result-transcript-unknown')
                }
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;