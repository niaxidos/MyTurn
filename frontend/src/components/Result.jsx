import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#1f1740' }}
    >
      <h1 className="text-5xl font-bold text-[#a678ff] mb-4 text-center">
        Result
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto w-full flex-1 py-4 px-0" style={{alignItems: 'start'}}>
        {/* Left Block: Pie Chart + Speaking Time stacked */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <div
            style={{ backgroundColor: '#2d2360', borderRadius: '1rem 1rem 1rem 1rem' }}
            className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-1 md:p-2 h-full"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
              Speaking %
            </h2>
            <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
              <Pie
                data={pieData}
                options={{ cutout: '70%', maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div
            style={{ backgroundColor: '#2d2360', borderRadius: '1rem 1rem 1rem 1rem' }}
            className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-2 md:p-3 h-full"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
              Speaking Time (seconds)
            </h2>
            <div className="flex flex-col gap-2 items-center">
              <span className="font-bold text-[#81C784] text-lg">Female: {secondsFemale} seconds</span>
              <span className="font-bold text-[#4FC3F7] text-lg">Male: {secondsMale} seconds</span>
              <span className="font-bold text-white text-lg mt-2">Total: {totalSeconds} seconds</span>
            </div>
          </div>
        </div>
        {/* Right Block: Transcript takes up two columns */}
        <div
          style={{ backgroundColor: '#2d2360', borderRadius: '1rem 1rem 1rem 1rem' }}
          className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-2 md:p-3 md:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
            Transcript
          </h2>
          <div className="w-full max-w-2xl h-96 overflow-y-auto custom-scrollbar bg-[#1f1740] rounded-lg p-4 shadow-inner">
            {transcript.map((line, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded text-lg font-medium ${
                  line.gender === 'female'
                    ? 'bg-[#81C784] text-black' // green for female
                    : line.gender === 'male'
                    ? 'bg-[#f3f4f6] text-black' // grey for male
                    : 'bg-[#f3f4f6] text-black' // light grey for unknown
                }`}
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