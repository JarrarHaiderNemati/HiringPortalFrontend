import { useState } from "react";
import {X} from 'lucide-react'
import Svg from "../../UI/Svg";
import Techstackrender from "./TechStackRender";
import ThanksModal from "./ThanksModal";

export default function Form() {
  const [techStack, setTechStack] = useState(["C++", "Python"]);

  const handleRemoveTech = (item) => {
    setTechStack(techStack.filter((tech) => tech !== item));
  };

  const addLanguage = (e) => {
    const value = e.target.value;
    if (value && !techStack.includes(value)) {
      setTechStack([...techStack, value]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
      <form className="bg-white py-8 px-16 rounded-lg shadow-md w-full max-w-2xl">
        {/* Personal Info */}
        <h1 className="text-3xl font-semibold mb-4">Personal Info</h1>

        <label className="block mb-2 text-sm font-medium">
          Name<span className="text-red-600 ml-1">*</span>
        </label>
        <input type="text" className="w-full px-4 text-sm mb-4 p-2 border rounded" />

        <label className="block mb-2 text-sm font-medium">Contact No:</label>
        <input type="text" className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <label className="block mb-2 text-sm font-medium">
          Email<span className="text-red-600 ml-1">*</span>
        </label>
        <input type="email" className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <label className="block mb-2 text-sm font-medium">Current Address:</label>
        <input type="text" className="w-full mb-6 px-4 text-sm p-2 border rounded" />

        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
    <ThanksModal />
  </div>  

        {/* Educational Background */}
        <h1 className="text-3xl font-semibold mb-4">Educational Background</h1>

        <label className="block mb-2 text-sm font-medium">
          Discipline<span className="text-red-600 ml-1">*</span>
        </label>
        <input type="text" className="w-full mb-4 px-4 text-sm p-2 border rounded" />

        <label className="block mb-2 text-sm font-medium">
          Graduation Year<span className="text-red-600 ml-1">*</span>
        </label>
        <input type="text" className="w-full mb-4 p-2 px-4 text-sm border rounded" />

        <label className="block mb-2 text-sm font-medium">University:</label>
        <input type="text" className="w-full mb-6 p-2 px-4 text-sm border rounded" />

        {/* Technical Background */}
        <h1 className="text-3xl font-semibold mb-1">Technical Background</h1>
        <p className="text-sm text-gray-600 mb-4">
          Give us a little background about yourself and your experience.
        </p>

        {/* Tech Stack Tags */}
        <div className="border p-6 rounded mb-4 flex flex-wrap gap-2 min-h-[70px]">
          {techStack.map((item) => (
            <Techstackrender 
              title={item}
              icon={X}
              onClick={() => handleRemoveTech(item)}
            />
            
          ))}
        </div>

        {/* Language Dropdown */}
        <label className="block mb-2 text-sm font-medium">
          Choose the Languages You Have Worked With:
        </label>
        <select
          className="w-full p-2 border rounded mb-6 cursor-pointer"
          onChange={(e) => addLanguage(e)}
        >
          <option value="">Select</option>
          <option value="Python">Python</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Angular">Angular</option>
          <option value="React">React</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end">
          <div className="flex gap-4">
            <button
              type="button"
              className="px-8 py-1 border rounded hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-1 bg-indigo-800 text-white rounded hover:bg-indigo-700"
            >
              Next
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
