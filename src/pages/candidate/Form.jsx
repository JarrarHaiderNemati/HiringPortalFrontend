import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import Techstackrender from "./TechStackRender";
import ThanksModal from "./ThanksModal";
import axios from "axios";
import P from "@components/UI/P";
import H1 from "@components/UI/H1";
import Input from "@components/UI/Input";
import Button from "@components/UI/Button";
import { useNavigate } from "react-router-dom";
import RegexTester from "LinksAndRegex/RegexTester";
import URLS from "LinksAndRegex/Endpoints";
import StatusCodes from "LinksAndRegex/SCODES";
import Renderskills from "./RenderSkills";

export default function Form() {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState(["C++", "Python"]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [graduation, setGraduation] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [university, setUniversity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getEmailAndName = async () => {
      const user_email = sessionStorage.getItem('email');
      try {
        const resp = await axios.post(URLS.GET_NAME_EMAIL, {
          email: user_email
        });
        const data = resp.data;

        if (data.status !== StatusCodes.SUCCESS) {
          alert('Error fetching name and email!');
          return;
        }
        setEmail(user_email);
        setName(data.name);
      }
      catch (err) {
        alert('Some error occurred!');
      }
    };
    getEmailAndName();
  }, []);

  const triggerModal = () => {
    window.dispatchEvent((new Event('openMyModal')));
  }

  const handleRemoveTech = (item) => {
    setTechStack(techStack.filter((tech) => tech !== item));
  };

  const addLanguage = (e) => {
    const value = e.target.value;
    if (value && !techStack.includes(value)) {
      setTechStack([...techStack, value]);
    }
  };

  const setPhoneNum = (e) => {
    const value = e.target.value.trim();
    const temp = RegexTester('phone', value)
    if (temp) {
      setContact(value);
    }
  };

  const setHomeAddress = (e) => setAddress(e.target.value);
  const setDiscip = (e) => setDiscipline(e.target.value);
  const setYear = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value)) {
      setGraduation(value);
    }
  };
  const setUni = (e) => setUniversity(e.target.value);

  const submitForm = async (e) => {
    e.preventDefault();
    if (techStack.length === 0 || !name || !email || !discipline || !graduation) {
      setMessage('All fields must be entered!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    setMessage('Submitting....');
    try {
      const resp = await axios.post(URLS.SUBMIT_FORM, {
        name,
        email,
        contact,
        address,
        university,
        graduation,
        discipline,
        techStack
      });

      const data = resp.data;
      if (data.status === StatusCodes.SUCCESS) {
        setMessage('Form submitted!');
        sessionStorage.setItem('formFilled', 'true');
        const reqs = await axios.post(URLS.SEND_EMAIL, {
          email,
          name,
          validateStatus: () => true
        });
        const data = reqs.data;
        if (data.status === StatusCodes.SUCCESS) {
          alert('Welcome email sent successfully ! ');
          triggerModal();
        }
        setTimeout(() => {
          setMessage('');
        }, 1500);
      }
    }
    catch (err) {
      alert('Some error occured ! ');
      console.log('Some error occured', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-8">
      <form className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-lg shadow-md px-4 sm:px-8 md:px-12 py-6 sm:py-8">
        <H1 className="text-3xl font-semibold mb-4">Personal Info</H1>

        <P className="mb-2 text-sm font-medium">
          Name<span className="text-red-600 ml-1">*</span>
        </P>
        <Input model="form" type="text" value={name || ''} readOnly autoComplete="off" />

        <P className="mb-2 text-sm font-medium">Contact No:</P>
        <Input model="form" value={contact} onChange={setPhoneNum} type="text" />

        <P className="mb-2 text-sm font-medium">
          Email<span className="text-red-600 ml-1">*</span>
        </P>
        <Input model="form" type="email" value={email || ''} readOnly />

        <P className="mb-2 text-sm font-medium">Current Address:</P>
        <Input model="form" value={address} onChange={setHomeAddress} type="text" />

        <ThanksModal />

        <H1 className="text-3xl font-semibold mb-4">Educational Background</H1>

        <P className="mb-2 text-sm font-medium">
          Discipline<span className="text-red-600 ml-1">*</span>
        </P>
        <Input model="form" value={discipline} onChange={setDiscip} type="text" />

        <P className="mb-2 text-sm font-medium">
          Graduation Year<span className="text-red-600 ml-1">*</span>
        </P>
        <Input model="form" value={graduation} onChange={setYear} type="text" />

        <P className="mb-2 text-sm font-medium">University:</P>
        <Input model="form" value={university} onChange={setUni} type="text" />

        <H1 className="text-3xl font-semibold mb-1">Technical Background</H1>
        <P className="text-sm text-gray-600 mb-4">
          Give us a little background about yourself and your experience.
        </P>

        <div className="border p-6 rounded mb-4 flex flex-wrap gap-2 min-h-[70px]">
          {techStack.map((item, index) => (
            <Techstackrender
              key={index}
              title={item}
              icon={X}
              onClick={() => handleRemoveTech(item)}
            />
          ))}
        </div>

        <P className="mb-2 text-sm font-medium">
          Choose the Languages You Have Worked With:
        </P>
        <select
          className="w-full p-2 border rounded mb-6 cursor-pointer"
          onChange={addLanguage}
        >
          <option value="">Select</option>
          <Renderskills />
        </select>

        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button onClick={() => navigate('/uploadresume')} type="back">
              Back
            </Button>
            <Button
              onClick={submitForm}
              type="next"
            >
              Next
            </Button>
          </div>
        </div>

        {message && (
          <P className={`${message === 'Form submitted!' ? 'text-green-500' : 'text-red-500'} text-lg mt-4`}>
            {message}
          </P>
        )}
      </form>
    </div>
  );
}
