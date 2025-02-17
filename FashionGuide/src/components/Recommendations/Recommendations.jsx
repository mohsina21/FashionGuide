import React from "react";
import { useLocation } from "react-router-dom";
import "./Recommendations.css";

const Recommendations = () => {
    const location = useLocation();
    const { recommendation } = location.state;

    const splitIntoSections = (text) => {
        return text.split("\n\n").map(section => {
            const lines = section.split("\n");
            const title = lines.shift().replace(/\*/g, "").trim();

            const content = lines.filter(line => line.trim().toUpperCase() !== "TOP")
                .map(line => {
                    let category = null;
                    let item = line;

                    const colonIndex = line.indexOf(':');
                    if (colonIndex > -1) {
                        category = line.substring(0, colonIndex).replace(/\*/g, "").trim();
                        item = line.substring(colonIndex + 1).replace(/\*/g, "").trim();
                    }

                    return { category, item };
                });

            return { title, content };
        });
    };

    const sections = splitIntoSections(recommendation);

    return (
        <div className="recommendations-container">
            <h1 className="title">Your Outfit Recommendations</h1>

            {sections.map((section, index) => (
                <div key={index} className="section-box">
                    <h2 className="section-title">{section.title}</h2>
                    {section.content.map((item, idx) => (
                        <div key={idx} className="response-item">
                            <div className="category-title" style={{ fontSize: item.category ? '1.2em' : '1em' }}>{item.category}</div>
                            <div>{item.item}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Recommendations;