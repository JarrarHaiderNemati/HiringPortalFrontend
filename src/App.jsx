import Login from "@pages/Auth/Login";
import Signup from "@pages/Auth/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Niche from "@pages/candidate/Niche";
import Uploadresume from "@pages/candidate/UploadResume";
import Form from "@pages/candidate/Form";
import Submitted from "@pages/candidate/Submitted";
import Guard from "@pages/Auth/Guard";
import StatusPage from "@pages/admin/StatusPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>

        <Route
          path="/niche"
          element={
            <Guard step='login'>
              <Niche />
            </Guard>
          }
        />
        <Route path="/submitted" element={<Guard step='form'><Submitted /></Guard>}></Route>
        <Route path="/uploadresume" element={<Guard step='niche'><Uploadresume /></Guard>}></Route>
        <Route path="/form" element={<Guard step='uploadResume'><Form /></Guard>}></Route>
        <Route path="/recieved" element={<Guard step='loginAdmin'><StatusPage status='Recieved' /></Guard>}></Route>
        <Route path="/shortlisted" element={<Guard step='loginAdmin'><StatusPage status='Shortlisted' /></Guard>}></Route>
      </Routes>
    </Router>

  );
}
