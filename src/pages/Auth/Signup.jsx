import Button from "@components/UI/Button";
import Input from "@components/UI/Input";
import P from "@components/UI/P";
import H1 from "@components/UI/H1";
import Image from "@components/UI/Image";
import adminImage from "../../assets/adminSystem.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import RegexTester from "LinksAndRegex/RegexTester";
import URLS from "LinksAndRegex/Endpoints";
import StatusCodes from "LinksAndRegex/SCODES";
import { useSelector, useDispatch } from 'react-redux';
import {
  setField,
  setMessage,
  setChecking,
  resetAuthFields
} from '@redux/authSlice';

export default function Signup() {
  const email = useSelector(state => state.auth.email);
  const password = useSelector(state => state.auth.password);
  const confirmPassword = useSelector(state => state.auth.confirmPassword);
  const name = useSelector(state => state.auth.name);
  const role = useSelector(state => state.auth.role);
  const message = useSelector(state => state.auth.message);
  const checking = useSelector(state => state.auth.checking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendSignupData = async () => {
    if (!email || !password || !name || !confirmPassword || !role) {
      dispatch(setMessage("All fields must be filled!"));
      setTimeout(() => dispatch(setMessage("")), 1500);
      return;
    }

    if (password !== confirmPassword) {
      dispatch(setMessage("Passwords do not match!"));
      setTimeout(() => dispatch(setMessage("")), 1500);
      return;
    }

    if (!RegexTester('email', email)) {
      dispatch(setMessage('Email format invalid!'));
      setTimeout(() => dispatch(setMessage("")), 1500);
      return;
    }

    dispatch(setChecking(true));

    try {
      const res = await axios.post(URLS.SIGNUP, {
        email,
        password,
        name,
        role
      });

      const data = res.data;

      if (data.status === StatusCodes.CONFLICT) {
        dispatch(setChecking(false));
        dispatch(setMessage("User already exists. Please login."));
      } else if (data.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        dispatch(setChecking(false));
        dispatch(setMessage("Server error. Please try again later."));
      } else {
        dispatch(setChecking(false));
        dispatch(setMessage("Signup successful!"));

        setTimeout(() => {
          dispatch(resetAuthFields());
          const destination = role === 'Admin' ? '/recieved' : '/niche';
          if (data.role === 'Admin') {
            sessionStorage.setItem('loggedAdmin', true);
            sessionStorage.setItem('email',email);
          }
          else {
            sessionStorage.setItem('email', email);
          }
          navigate(destination);
        }, 1500);
        return;
      }

      setTimeout(() => dispatch(setMessage("")), 1500);
    } catch (err) {
      dispatch(setChecking(false));
      console.error("Signup error:", err);
      dispatch(setMessage("Something went wrong!"));
      setTimeout(() => dispatch(setMessage("")), 1500);
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
            model="login"
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => dispatch(setField({ field: 'email', value: e.target.value }))}
          />

          <Input
            model="login"
            value={name}
            type="text"
            placeholder="Name"
            onChange={(e) => dispatch(setField({ field: 'name', value: e.target.value }))}
          />

          <Input
            model="login"
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => dispatch(setField({ field: 'password', value: e.target.value }))}
          />

          <Input
            model="login"
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => dispatch(setField({ field: 'confirmPassword', value: e.target.value }))}
          />

          {checking && (
            <P className="mt-2 font-semibold text-sm text-gray-800">Checking...</P>
          )}

          {message && (
            <P className={`mt-2 font-semibold text-sm ${message === "Signup successful!" ? "text-green-500" : "text-red-500"}`}>
              {message}
            </P>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-4 w-full">
            <Button
              type="button"
              onClick={() => dispatch(setField({ field: 'role', value: 'Admin' }))}
              className={`w-full md:w-1/2 py-2 rounded-lg text-sm font-semibold ${
                role === "Admin"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Admin
            </Button>

            <Button
              type="button"
              onClick={() => dispatch(setField({ field: 'role', value: 'User' }))}
              className={`w-full md:w-1/2 py-2 rounded-lg text-sm font-semibold ${
                role === "User"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              User
            </Button>
          </div>

          <Button
            type="button"
            onClick={sendSignupData}
            className="py-2 px-6 rounded-lg bg-loginColor text-white text-sm hover:bg-blue-700 mt-6"
          >
            Signup
          </Button>

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

        <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center">
          <Image className="w-full h-auto max-h-[500px] object-contain" src={adminImage} />
        </div>
      </div>
    </div>
  );
}
