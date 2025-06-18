import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Niche from "./components/candidate/Niche";
import Admin from "./components/admin/Admin";
import Uploadresume from "./components/candidate/UploadResume";
import Form from "./components/candidate/Form";
import Submitted from "./components/candidate/Submitted";

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
        <Route path="/admin" element={<Admin/>}></Route>
        <Route path="/niche" element={<Niche/>}></Route>
      </Routes>
    </Router>
    
  );
}
