import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <motion.h1 
        className="home-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <span className="highlight">FashionGuide</span>
      </motion.h1>
      <p className="home-text">
        Your AI-powered fashion assistant! Get personalized outfit recommendations based on your unique style.
      </p>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <Link to="/style-recommendation">
          <button className="home-button">
            Get Styled Now
          </button>
        </Link>
      </motion.div>

     
    </div>
  );
};

export default Home;
