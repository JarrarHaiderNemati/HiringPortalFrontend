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
import StatusCodes from "../../SCODES";
import LINK from "../BackendLink";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const sendLoginData = async () => {
    if (!email || !password) {
      setMessage('All fields must be entered!');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    if (!RegexTester('email',email)) {
      setMessage('Email format invalid!');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    setChecking(true);

    try {
      const res = await axios.post(`${LINK}/login`, {
        email,
        password,
      });

      const data = res.data;

      if (data.status === StatusCodes.SUCCESS) {
        sessionStorage.setItem('email', email);
        setMessage("Login Successful!");
        setEmail('');
        setPassword('');
        setTimeout(() => {
          setMessage('');
          navigate(data.role === 'User' ? '/niche' : '/recieved');
        }, 1500);
        setChecking(false);
        return;
      }

      setTimeout(() => setMessage(''), 1500);
      setChecking(false);

    } catch (error) {
      setChecking(false);
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Something went wrong");
      } else {
        setMessage("Network error or server is unreachable");
      }

      setTimeout(() => setMessage(''), 1500);
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
            value={password}
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          {checking && (
            <P className='mt-2 font-semibold text-sm text-gray-800'>Checking...</P>
          )}

          {message && (
            <P className={`mt-2 font-semibold text-sm ${message === "Login Successful!" ? "text-green-500" : "text-red-500"}`}>
              {message}
            </P>
          )}

          <Button
            children="Login"
            className="py-2 px-6 rounded-lg bg-loginColor text-white text-sm hover:bg-blue-700 mt-6"
            onClick={sendLoginData}
          />

          <div className="flex mt-10 items-center gap-2 text-sm">
            <P className="text-gray-600">Don't have an account?</P>
            <P
              className="text-purple-600 hover:underline cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Sign up
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
