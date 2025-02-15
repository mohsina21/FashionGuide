import React, { useState } from "react";
import "./StyleRecommender.css";

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

    const isFormValid = Object.values(formData).every((val) => val.trim() !== "");
    if (!isFormValid) {
      setError("Please fill in all fields before submitting.");
      setLoading(false);
      return;
    }

    console.log("Submitting form with data:", formData);

    const prompt = `Suggest an outfit for a ${formData.gender} attending a ${formData.occasion} event in ${formData.weather} weather, with a ${formData.bodyType} body type, who prefers ${formData.stylePreference} style.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

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

  const isFormValid = Object.values(formData).every((val) => val.trim() !== "");

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

        <button type="submit" className="submit-button" disabled={!isFormValid || loading}>
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
