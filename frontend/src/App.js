import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Register } from './LoginComponents';
import Home from './Home';

export default function App() {
  return (
    <div>
      <h1>Tout Doux</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <footer>
        <p>&copy; 2023 Baudouin Théobald</p>
      </footer>
    </div>
  );
}
