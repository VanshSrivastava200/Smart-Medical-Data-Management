import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile"
import Home from "./pages/Home";
import DoctorHome from "./pages/Dashboards/DoctorHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/doctordashboard" element={<DoctorHome />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
