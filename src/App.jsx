import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Niche from "./components/candidate/Niche";
import Uploadresume from "./components/candidate/UploadResume";
import Form from "./components/candidate/Form";
import Submitted from "./components/candidate/Submitted";
import Recieved from "./components/admin/Recieved";
import Shortlisted from "./components/admin/Shortlisted";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>

        <Route path="/niche" element={<Niche/>}></Route>
        <Route path="/submitted" element={<Submitted/>}></Route> */
        <Route path="/uploadresume" element={<Uploadresume/>}></Route>
        <Route path="/form" element={<Form/>}></Route>
        <Route path="/recieved" element={<Recieved/>}></Route>
        <Route path="/niche" element={<Niche/>}></Route>
        <Route path="/shortlisted" element={<Shortlisted/>}></Route>
      </Routes>
    </Router>
    
  );
}
