import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home';
import { Login, Register } from './LoginComponents';

export default function App() {
  return (
    <div>
      <header>
        <h1>Tout Doux</h1>
      </header>
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/project/:project_id" element={<Home />} />
            <Route exact path="*" element={<strong>Not Found</strong>} />
          </Routes>
        </BrowserRouter>
      </div>
      <footer>
        <p>© 2023 Baudouin Théobald</p>
      </footer>
    </div>
  );
}
