import { useSelector, useDispatch } from 'react-redux';
import {
  setField,
  setMessage,
  setChecking,
  resetAuthFields
} from '@redux/authSlice';
import Button from "@components/UI/Button";
import Input from "@components/UI/Input";
import P from "@components/UI/P";
import H1 from "@components/UI/H1";
import Image from "@components/UI/Image";
import adminImage from "../../assets/adminSystem.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import RegexTester from "LinksAndRegex/RegexTester";
import StatusCodes from "LinksAndRegex/SCODES";
import URLS from "LinksAndRegex/Endpoints";

export default function Login() {
  const email = useSelector(state => state.auth.email);
  const password = useSelector(state => state.auth.password);
  const message = useSelector(state => state.auth.message);
  const checking = useSelector(state => state.auth.checking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendLoginData = async () => {
    if (!email || !password) {
      dispatch(setMessage("All fields must be entered!"));
      setTimeout(() => dispatch(setMessage('')), 1500);
      return;
    }

    if (!RegexTester('email', email)) {
      dispatch(setMessage("Invalid email format!"));
      setTimeout(() => dispatch(setMessage('')), 1500);
      return;
    }

    dispatch(setChecking(true));

    try {
      const res = await axios.post(URLS.LOGIN, {
        email,
        password,
      });

      const data = res.data;

      if (data.status === StatusCodes.SUCCESS) {
        dispatch(setMessage("Login Successful!"));

        setTimeout(() => {
          dispatch(resetAuthFields());
          const destination = data.role === 'User' ? '/niche' : '/recieved';
          if (data.role !== 'User') {
            sessionStorage.setItem('loggedAdmin', true);
            sessionStorage.setItem('email', email);
          }
          else {
            sessionStorage.setItem('email',email);
          }
          navigate(destination);
        }, 1500);

        dispatch(setChecking(false));
        return;
      }

      dispatch(setChecking(false));
      dispatch(setMessage("Login failed."));
      setTimeout(() => dispatch(setMessage('')), 1500);
    } catch (error) {
      dispatch(setChecking(false));
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        dispatch(setMessage(error.response.data.message || "Something went wrong"));
      } else {
        dispatch(setMessage("Network error or server is unreachable"));
      }

      setTimeout(() => dispatch(setMessage('')), 1500);
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
            model='login'
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) =>
              dispatch(setField({ field: 'email', value: e.target.value }))
            }
          />

          <Input
            model='login'
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) =>
              dispatch(setField({ field: 'password', value: e.target.value }))
            }
          />

          {checking && (
            <P className="mt-2 font-semibold text-sm text-gray-800">Checking...</P>
          )}

          {message && (
            <P
              className={`mt-2 font-semibold text-sm ${message === "Login Successful!" ? "text-green-500" : "text-red-500"
                }`}
            >
              {message}
            </P>
          )}

          <Button
            className="py-2 px-6 rounded-lg bg-loginColor text-white text-sm hover:bg-blue-700 mt-6"
            onClick={sendLoginData}
          >
            Login
          </Button>

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

        <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center">
          <Image
            className="w-full h-auto max-h-[500px] object-contain"
            src={adminImage}
          />
        </div>
      </div>
    </div>
  );
}
