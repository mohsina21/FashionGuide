import React from "react";
import { useLocation } from "react-router-dom";
import "./Recommendations.css";

const Recommendations = () => {
  const location = useLocation();
  const { recommendation } = location.state;

  return (
    <div className="recommendations-container">
      <h1 className="title">Your Outfit Recommendations</h1>
      <div className="recommendation-content">
        {recommendation.split('\n\n').map((option, index) => (
          <div key={index} className="option-card">
            <h2>Recommendation {index + 1}</h2>
            {option.split('\n').map((item, idx) => (
              <div key={idx} className="response-item">
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;