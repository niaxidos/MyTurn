import React from 'react';
import './dummy.css';

const Dummy = ({ data }) => {
  if (!data) return <p>No data yet.</p>;
  const transcriptItems = [];
  for (let i = 0; i < data.transcript.length; i++) {
    transcriptItems.push(<p key={i}>{data.transcript[i]}</p>);
  }
  return (
    <div className="dummy-container">
      <p className="dummy-mt4">
        <strong>Male Speech:</strong> {(data.male_ratio * 100).toFixed(1)}% ({data.male_seconds.toFixed(2)}s)<br />
        <strong>Female Speech:</strong> {(data.female_ratio * 100).toFixed(1)}% ({data.female_seconds.toFixed(2)}s)<br />
        <strong>Total:</strong> {data.total_seconds.toFixed(2)} seconds
      </p>
      <h2 className="dummy-title">Transcription Result</h2>
      {transcriptItems}
    </div>
  );
};

export default Dummy;