import React, { useState, useEffect } from "react";

const AIAssistant = ({ fetchSuggestions }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [suggestions, setSuggestions] = useState("");

    // Fetch AI suggestions when the popup opens
    useEffect(() => {
        if (showPopup) {
            fetchSuggestions()
                .then(response => setSuggestions(response))
                .catch(error => console.error("Error fetching suggestions:", error));
        }
    }, [showPopup]);

    return (
        <div className="input-with-ai">
            <textarea placeholder="Enter Reason of Failure..."></textarea>
            <button 
                className="ai-assistant-btn"
                onClick={() => setShowPopup(true)}
            >
                ✨
            </button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>AI Suggestions</h3>
                        <div className="suggestions">
                            {suggestions || "Fetching suggestions..."}
                        </div>
                        <button 
                            className="btn-secondary"
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
