import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./StyleRecommender.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Recommendations from "../Recommendations/Recommendations";

const genAI = new GoogleGenerativeAI("AIzaSyDJxy5w92Pm8ixTuFabJG3SGaMKWzIVvSg");  
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const StyleRecommender = () => {
  const [formData, setFormData] = useState({
    gender: "",
    occasion: "",
    weather: "",
    bodyType: "",
    stylePreference: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if all fields are filled out
    for (let key in formData) {
      if (!formData[key]) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }
    }

    const prompt = `Suggest an outfit for a ${formData.gender} attending a ${formData.occasion} event in ${formData.weather} weather, with a ${formData.bodyType} body type, who prefers ${formData.stylePreference} style.`;

    try {
      const result = await model.generateContent(prompt);

      if (!result) {
        throw new Error("No recommendation received.");
      }

      // Assuming the response contains a single text in 'result.response.text'
      const recommendation = result.response.text();
      history.push("/recommendations", { recommendation });
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
    </div>
  );
};

export default StyleRecommender;
