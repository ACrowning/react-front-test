import Home from "./pages/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Participants } from "./pages/Participants";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event/:eventId/participants" element={<Participants />} />
    </Routes>
  </Router>
);

export default App;
