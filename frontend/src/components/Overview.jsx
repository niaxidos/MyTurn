import React, { useEffect, useState, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import data from '../data.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Overview = () => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: 'Male',
        data: data.map((entry) => entry.male),
        borderColor: '#81C784', // light green
        backgroundColor: 'rgba(129, 199, 132, 0.6)',
      },
      {
        label: 'Female',
        data: data.map((entry) => entry.female),
        borderColor: '#4FC3F7', // light blue
        backgroundColor: 'rgba(79, 195, 247, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Male vs Female Data Over Time',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Percentage (%)',
        },
        min: 0,
        max: 100,
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  const totalMeetings = data.length;
  const [displayedMeetings, setDisplayedMeetings] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    if (!counterRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          let start = 0;
          const duration = 1000; // ms
          const increment = Math.ceil(totalMeetings / 40); // ~25fps
          if (totalMeetings === 0) return;
          const stepTime = Math.max(duration / totalMeetings, 15);
          const timer = setInterval(() => {
            start += increment;
            if (start >= totalMeetings) {
              setDisplayedMeetings(totalMeetings);
              clearInterval(timer);
            } else {
              setDisplayedMeetings(start);
            }
          }, stepTime);
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [totalMeetings, hasAnimated]);

  const averageMalePercentage = (
    data.reduce((sum, entry) => sum + entry.male, 0) / data.length
  ).toFixed(2);
  const averageFemalePercentage = (
    data.reduce((sum, entry) => sum + entry.female, 0) / data.length
  ).toFixed(2);

  const pieData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [averageMalePercentage, averageFemalePercentage],
        backgroundColor: [
          'rgba(129, 199, 132, 0.6)',
          'rgba(79, 195, 247, 0.6)',
        ],
        borderColor: ['#81C784', '#4FC3F7'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#1f1740' }}
    >
      <h1 className="text-5xl font-bold text-[#a678ff] mb-4 text-center">
        Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto w-full flex-1 py-4 px-0 overflow-auto">
        {/* Line Chart Tile - spans two rows on desktop */}
        <div
          style={{ backgroundColor: '#2d2360' }}
          className="rounded-2xl shadow-lg flex flex-col items-center justify-center md:row-span-2 md:col-span-2 p-2 md:p-3 h-full"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
            Speaking Time Over Time
          </h2>
          <div className="w-full h-full" style={{ minHeight: '320px' }}>
            <Line
              data={chartData}
              options={{ ...options, maintainAspectRatio: false }}
              height={320}
            />
          </div>
        </div>
        {/* Pie Chart Tile */}
        <div
          style={{ backgroundColor: '#2d2360' }}
          className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-1 md:p-2 h-full"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
            Average Speaking %
          </h2>
          <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
            <Pie
              data={pieData}
              options={{ cutout: '70%', maintainAspectRatio: false }}
            />
          </div>
        </div>
        {/* Animated Counter Tile */}
        <div
          style={{ backgroundColor: '#2d2360' }}
          className="rounded-2xl shadow-lg flex flex-col items-center justify-center p-2 md:p-3"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#a678ff]">
            Total Meetings
          </h2>
          <span
            ref={counterRef}
            className="flex items-center justify-center rounded-full bg-[#a678ff] text-white font-bold text-4xl md:text-5xl w-20 h-20 md:w-24 md:h-24 shadow mb-2"
            style={{ minWidth: '5rem', minHeight: '5rem' }}
          >
            {displayedMeetings}
          </span>
          <span className="text-lg md:text-xl text-gray-200 font-medium">
            You have analyzed{' '}
            <span className="font-bold text-[#a678ff]">meetings</span>.
          </span>
        </div>
      </div>
      <footer className="w-full text-center text-gray-400 py-4 mt-4 border-t border-[#2d2360]">
        © 2025 MyTurn. All rights reserved.
      </footer>
    </div>
  );
};

export default Overview;