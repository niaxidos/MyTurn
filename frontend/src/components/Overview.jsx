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
import '../Overview.css';

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
    <div className="overview-root">
      <h1 className="overview-title">Overview</h1>
      <div className="overview-grid">
        <div className="overview-tile" style={{ gridColumn: 'span 2' }}>
          <h2 className="overview-tile-title">Speaking Time Over Time</h2>
          <div style={{ minHeight: '320px', width: '100%' }}>
            <Line
              data={chartData}
              options={{ ...options, maintainAspectRatio: false }}
              height={320}
            />
          </div>
        </div>
        <div className="overview-tile">
          <h2 className="overview-tile-title">Average Speaking %</h2>
          <div style={{ width: '8rem', height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pie
              data={pieData}
              options={{ cutout: '70%', maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="overview-tile">
          <h2 className="overview-tile-title">Total Meetings</h2>
          <span ref={counterRef} className="overview-counter">
            {displayedMeetings}
          </span>
          <span style={{ color: '#fff', fontWeight: '500' }}>
            You have analyzed <span style={{ color: '#a678ff', fontWeight: 'bold' }}>meetings</span>.
          </span>
        </div>
      </div>
      <footer className="overview-footer">
        © 2025 MyTurn. All rights reserved.
      </footer>
    </div>
  );
}

export default Overview;