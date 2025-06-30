import Roles from "./Roles";
import Role from "./Role";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import P from "@components/UI/P";
import H1 from "@components/UI/H1";
import Submitted from "./Submitted";
import URLS from "LinksAndRegex/Endpoints";
import StatusCodes from "LinksAndRegex/SCODES";

export default function Niche() {
  const [niche, setNiche] = useState('');
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findUser = async () => {
      const user_email = sessionStorage.getItem('email');
      try {
        const resp = await axios.get(`${URLS.SEARCH_USER}?email=${user_email}`, {
          validateStatus: () => true
        });
        const data = resp.data;
        if (data.status === StatusCodes.SUCCESS) {
          setCompleted(true);
          setLoading(false);
        } else if (data.status === StatusCodes.NOT_FOUND) {
          setCompleted(false);
          setLoading(false);
        } else {
          alert('Unexpected error occurred!');
          setLoading(false);
        }
      }
      catch (err) {
        alert('Some error occured ! ');
        setLoading(false);
      }
    }
    findUser();
  }, [])

  const saveNiche = async (role) => {
    sessionStorage.setItem('Niche', role.title);
    const email = sessionStorage.getItem('email');

    try {
      const resp = await axios.post(URLS.SAVE_NICHE, {
        email,
        niche: role.title
      });

      const data = resp.data;
      if (data.status !== StatusCodes.SUCCESS) {
        alert('Issue picking niche !');
      } else {
        setNiche(role.title);
        sessionStorage.setItem('nicheDone', 'true');
        setTimeout(() => {
          setNiche('');
          navigate('/uploadresume');
        }, 1500);
      }
    } catch (err) {
      alert('Some error occurred !');
    }
  };

  return (
    
      loading ? (
        <P children='Loading...' className='text-green-600 text-lg text-semibold m-4' />
      ) : (
        !completed ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 relative">
            <div className="relative w-full flex items-center justify-center text-center mb-12">
              <P className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-gray-200 absolute z-0">
                WE ARE HIRING
              </P>
              <H1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 z-10">
                WE ARE HIRING
              </H1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Roles.map((role, index) => (
                <Role
                  onClick={() => saveNiche(role)}
                  key={index}
                  role={role.title}
                  icon={role.icon}
                />
              ))}
            </div>

            {niche && (
              <P className="text-lg text-green-500 mt-8">
                Picked {niche} niche
              </P>
            )}
          </div>
        ) : (
          <Submitted />
        )
      )
    
  );
}
