import Roles from "./Roles";
import Role from "./Role";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Confmodal from "../../UI/Confmodal";

export default function Niche() {
  const navigate = useNavigate();
  const [nicheSelected, setNiche] = useState('');
  const [modal, showModal] = useState(false);
  const [Icon, setIcon] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 relative">
      <div className="relative w-full flex items-center justify-center text-center mb-12">
        <p className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-gray-200 absolute z-0">
          WE ARE HIRING
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 z-10">
          WE ARE HIRING
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Roles.map((role, index) => (
          <Role
            key={index}
            role={role.title}
            icon={role.icon}
          />
        ))}
      </div>
    </div>
  );
}
