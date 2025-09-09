import React, { useState } from 'react';

export default function Popup() {
    const [showModal, setShowModal] = useState(true);
    if (showModal) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="text-center relative w-[32rem] h-[27rem] p-6 backdrop-blur-lg bg-white/20 rounded-2xl flex flex-col gap-8 items-center justify-center">
                <button
                className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#a678ff] transition-colors duration-300"
                aria-label="Close popup"
                onClick={() => setShowModal(false)}
                >
                &times;
                </button>
                <p className="text-white text-3xl font-bold">Hey there!</p>
                <p className="text-white text-lg">We are <span className="text-[#a678ff] font-bold">MyTurn</span>, a tool that records audio during meetings to measure how much <span className="text-blue-400 font-bold">men and women</span> speak to see if one group tends to dominate the conversation. We only use the recordings for <span className="text-blue-400 font-bold">analysis. No one outside your team will hear them :)</span></p>
            </div>
            </div>
        );
    } else {
        return ""
    }
}
