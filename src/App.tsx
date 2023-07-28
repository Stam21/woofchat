import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Views/Register";
import Home from "./Views/Home";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;
