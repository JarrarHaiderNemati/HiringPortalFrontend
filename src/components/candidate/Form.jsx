import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import Techstackrender from "./TechStackRender";
import ThanksModal from "./ThanksModal";
import axios from "axios";
import P from "../../UI/P";
import H1 from "../../UI/H1";
import Input from "../../UI/Input";
import Button from "../../UI/Button"; // optional if you have one
import { useNavigate } from "react-router-dom";
import RegexTester from "../../RegexTester";
import LINK from "../../BackendLink";
import StatusCodes from '../../../SCODES';

export default function Form() {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState(["C++", "Python"]);
  const [submitted, setSubmitted] = useState(false);
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
        const resp = await axios.post(`${LINK}/getNameAndEmail`, {
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
    const temp= RegexTester('phone',value)
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
      const resp = await axios.post(`${LINK}/submitForm`, {
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
        const reqs = await axios.post(`${LINK}/sendemail`, {
          email,
          name,
          validateStatus: () => true
        });
        const data = reqs.data;
        if (data.status === StatusCodes.SUCCESS) {
          alert('Welcome email sent successfully ! ');
        }
        setTimeout(() => {
          setMessage('');
          setSubmitted(true);
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
        <Input type="text" value={name || ''} readOnly autoComplete="off" className="w-full px-4 text-sm mb-4 p-2 border rounded" />

        <P className="mb-2 text-sm font-medium">Contact No:</P>
        <Input value={contact} onChange={setPhoneNum} type="text" className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <P className="mb-2 text-sm font-medium">
          Email<span className="text-red-600 ml-1">*</span>
        </P>
        <Input type="email" value={email || ''} readOnly className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <P className="mb-2 text-sm font-medium">Current Address:</P>
        <Input value={address} onChange={setHomeAddress} type="text" className="w-full mb-6 px-4 text-sm p-2 border rounded" />

            <ThanksModal submitted={submitted} />

        <H1 className="text-3xl font-semibold mb-4">Educational Background</H1>

        <P className="mb-2 text-sm font-medium">
          Discipline<span className="text-red-600 ml-1">*</span>
        </P>
        <Input value={discipline} onChange={setDiscip} type="text" className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <P className="mb-2 text-sm font-medium">
          Graduation Year<span className="text-red-600 ml-1">*</span>
        </P>
        <Input value={graduation} onChange={setYear} type="text" className="w-full mb-4 p-2 px-4 text-sm border rounded" />

        <P className="mb-2 text-sm font-medium">University:</P>
        <Input value={university} onChange={setUni} type="text" className="w-full mb-6 p-2 px-4 text-sm border rounded" />

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
          <option value="Python">Python</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Angular">Angular</option>
          <option value="React">React</option>
        </select>

        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button onClick={() => navigate('/uploadresume')} type="button" className="px-8 py-1 border rounded hover:bg-gray-100">
              Back
            </Button>
            <Button
              onClick={submitForm}
              type="submit"
              className="px-8 py-1 bg-indigo-800 text-white rounded hover:bg-indigo-700"
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
