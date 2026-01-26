import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserWrapper from "./wrapper/UserWrapper";
import DoctorWrapper from "./wrapper/DoctorWrapper";
import HospitalWrapper from "./wrapper/HospitalWrapper";
import Home from "./pages/user/UserHome";
import AppointmentBook from "./pages/user/AppointmentBook";
 
function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/user/home" element={<UserWrapper><Home /></UserWrapper>} />
      <Route path="/user/book-appointment" element={<UserWrapper><AppointmentBook /></UserWrapper>} />

     
    </Routes>
  );
}

export default App;
