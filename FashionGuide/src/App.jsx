import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import StyleRecommender from "./components/StyleRecommender/StyleRecommender";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/style-recommendation" element={<StyleRecommender />} />
    </Routes>
  );
}

export default App;
