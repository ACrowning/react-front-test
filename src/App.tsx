import Home from "./pages/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
