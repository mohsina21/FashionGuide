import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StyleRecommender from "./components/StyleRecommender/StyleRecommender";
import Recommendations from "./components/Recommendations/Recommendations";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StyleRecommender} />
        <Route path="/recommendations" component={Recommendations} />
      </Switch>
    </Router>
  );
};

export default App;
