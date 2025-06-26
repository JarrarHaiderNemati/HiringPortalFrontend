import Button from "../UI/Button";
import Input from "../UI/Input";
import P from "../UI/P";
import H1 from "../UI/H1";
import Image from "../UI/Image";
import adminImage from "../assets/adminSystem.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import RegexTester from "../RegexTester";
import LINK from "../BackendLink";
import StatusCodes from "../../SCODES";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfPass] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const sendSignupData = async () => {
    if (!email || !password || !name || !confirmPassword || !role) {
      setMessage("All fields must be filled!");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    if (!RegexTester('email',email)) {
      setMessage('Email format invalid!');
      setTimeout(() => setMessage(''), 1500);
      return;
    }

    setChecking(true);

    try {
      const res = await axios.post(`${LINK}/signup`, {
        email,
        password,
        name,
        role
      });

      const data = res.data;

      if (data.status === StatusCodes.CONFLICT) {
        setChecking(false);
        setMessage("User already exists. Please login.");
      } else if (data.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        setChecking(false);
        setMessage("Server error. Please try again later.");
      } else {
        setChecking(false);
        setMessage("Signup successful!");
        sessionStorage.setItem('email', email);
        setEmail('');
        setPassword('');
        setConfPass('');
        setName('');
        setRole('');

        setTimeout(() => {
          setMessage("");
          navigate(role === 'Admin' ? '/recieved' : '/niche');
        }, 1500);
        return;
      }

      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setChecking(false);
      console.error("Signup error:", err);
      setMessage("Something went wrong!");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden w-full max-w-6xl">

        <div className="w-full md:w-1/2 px-6 py-10 md:px-16 md:py-20">
          <P className="font-arial text-sm font-bold mb-10">AdminSystem</P>

          <H1 className="mb-4">
            <span className="block text-2xl md:text-4xl font-bold">Hello,</span>
            <span className="block text-2xl md:text-4xl font-bold">Welcome Back</span>
          </H1>

          <P className="text-gray-600 text-sm mb-10">
            Hey, welcome back to your special place
          </P>

          <Input
            value={email}
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            value={name}
            type="text"
            placeholder="Name"
            className="w-full mb-3 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            value={password}
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-2 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setConfPass(e.target.value)}
          />

          {checking && (
            <P className='mt-2 font-semibold text-sm text-gray-800'>Checking...</P>
          )}

          {message && (
            <P className={`mt-2 font-semibold text-sm ${message === "Signup successful!" ? "text-green-500" : "text-red-500"}`}>
              {message}
            </P>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-4 w-full">
            <Button
              type="button"
              onClick={() => setRole("Admin")}
              className={`w-full md:w-1/2 py-2 rounded-lg text-sm font-semibold ${
                role === "Admin"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              children="Admin"
            />

            <Button
              type="button"
              onClick={() => setRole("User")}
              className={`w-full md:w-1/2 py-2 rounded-lg text-sm font-semibold ${
                role === "User"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              children="User"
            />
          </div>

          <Button
            onClick={sendSignupData}
            className="py-2 px-6 rounded-lg bg-loginColor text-white text-sm hover:bg-blue-700 mt-6"
            children="Signup"
          />

          <div className="flex mt-10 items-center gap-2 text-sm">
            <P className="text-gray-600">Already have an account?</P>
            <P
              className="text-purple-600 hover:underline cursor-pointer"
              onClick={() => navigate('/')}
            >
              Login
            </P>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <Image className="w-full h-full object-cover" src={adminImage} />
        </div>
      </div>
    </div>
  );
}
