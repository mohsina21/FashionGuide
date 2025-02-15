import React, { useState } from "react";
import "./StyleRecommender.css";

let lastRequestTime = 0; // Track last request time

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, delayMs = 5000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      console.warn(`429 Error: Retrying in ${delayMs}ms... (Attempt ${attempt + 1})`);
      await delay(delayMs);
      delayMs *= 2; // Increase delay exponentially (5s -> 10s -> 20s)
    } else {
      return response;
    }
  }

  throw new Error("Too many requests. Please try again later.");
};

const StyleRecommender = () => {
  const [formData, setFormData] = useState({
    gender: "",
    occasion: "",
    weather: "",
    bodyType: "",
    stylePreference: "",
  });

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendation("");

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError("API Key is missing. Make sure it's defined in the .env file.");
      setLoading(false);
      return;
    }

    const prompt = `Suggest an outfit for a ${formData.gender} attending a ${formData.occasion} event in ${formData.weather} weather, with a ${formData.bodyType} body type, who prefers ${formData.stylePreference} style.`;

    try {
      const response = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No recommendation received.");
      }

      setRecommendation(data.choices[0].message.content);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="style-recommender-container">
      <h1 className="title">Find Your Perfect Outfit 🎀🪞</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-Binary</option>
        </select>

        <label>Occasion:</label>
        <input type="text" name="occasion" value={formData.occasion} onChange={handleChange} placeholder="Casual, Formal, Party, etc." required />

        <label>Weather:</label>
        <input type="text" name="weather" value={formData.weather} onChange={handleChange} placeholder="Sunny, Rainy, Cold, etc." required />

        <label>Body Type:</label>
        <input type="text" name="bodyType" value={formData.bodyType} onChange={handleChange} placeholder="Slim, Athletic, Plus-size, etc." required />

        <label>Style Preference:</label>
        <input type="text" name="stylePreference" value={formData.stylePreference} onChange={handleChange} placeholder="Casual, Chic, Sporty, etc." required />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Fetching..." : "Get Recommendation"}
        </button>
      </form>

      {error && <div className="error-box">❌ {error}</div>}

      {recommendation && !error && (
        <div className="recommendation-box">
          <h2>Recommended Outfit:</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default StyleRecommender;
