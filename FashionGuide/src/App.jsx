import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import StyleRecommender from "./components/StyleRecommender/StyleRecommender";
import Recommendations from "./components/Recommendations/Recommendations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/style-recommendation" element={<StyleRecommender />} />
      <Route path="/recommendations" element={<Recommendations />} />
    </Routes>
  );
}

export default App;
