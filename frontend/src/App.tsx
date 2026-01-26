import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserWrapper from "./wrapper/UserWrapper";
import DoctorWrapper from "./wrapper/DoctorWrapper";
import HospitalWrapper from "./wrapper/HospitalWrapper";

import UserHome from "./pages/user/UserHome";
import AppointmentBook from "./pages/user/AppointmentBook";

import DoctorHome from "./pages/doctor/DoctorHome";

import HospitalHome from "./pages/hospital/HospitalHome";
import HospitalSettings from "./pages/hospital/HospitalSettings";


function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/user/home" element={<UserWrapper><UserHome /></UserWrapper>} />
      <Route path="/user/book-appointment" element={<UserWrapper><AppointmentBook /></UserWrapper>} />
      
      <Route path="/doctor/home" element={<DoctorWrapper><DoctorHome /></DoctorWrapper>} />
      
      <Route path="/hospital/home" element={<HospitalWrapper><HospitalHome /></HospitalWrapper>} />
      <Route path="/hospital/settings" element={<HospitalWrapper><HospitalSettings /></HospitalWrapper>} />

     
    </Routes>
  );
}

export default App;
