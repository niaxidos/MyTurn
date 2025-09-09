import React, { useState } from 'react';
import '../Popup.css';

export default function Popup() {
    const [showModal, setShowModal] = useState(true);
    if (showModal) {
        return (
            <div className="popup-overlay">
            <div className="popup-modal">
                <button
                className="popup-close"
                aria-label="Close popup"
                onClick={() => setShowModal(false)}
                >
                &times;
                </button>
                <p className="popup-title">Hey there!</p>
                <p className="popup-desc">
                  We are <span className="popup-highlight">MyTurn</span>, a tool that records audio during meetings to measure how much <span className="popup-blue">men and women</span> speak to see if one group tends to dominate the conversation. We only use the recordings for <span className="popup-blue">analysis. No one outside your team will hear them :)</span>
                </p>
            </div>
            </div>
        );
    } else {
        return ""
    }
}