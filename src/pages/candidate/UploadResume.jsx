import { useEffect, useRef, useState } from "react";
import P from "@components/UI/P";
import Button from "@components/UI/Button";
import { X } from "lucide-react";
import Svg from "@components/UI/Svg";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import URLS from "LinksAndRegex/Endpoints";
import StatusCodes from "LinksAndRegex/SCODES";

export default function Uploadresume() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState('');
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const triggerFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      alert("Only PDF or Word documents are allowed!");
      return;
    }
    setFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!allowedTypes.includes(droppedFile.type)) {
      alert("Only PDF or Word documents are allowed!");
      return;
    }

    setFile(droppedFile);
  };


  const uploadResume = async () => {
    if (!file) {
      alert('Cant upload resume due to it being null ! ');
      return;
    }
    const email = sessionStorage.getItem('email');
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", email);
    try {
      const reqs = await axios.post(URLS.UPLOADS, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        validateStatus: () => true
      });

      const data = reqs.data;
      if (data.status === StatusCodes.SUCCESS) {
        setMessage('Resume Uploaded !');
        sessionStorage.setItem("resumeUploaded", "true");
        setFile(null);
        setTimeout(() => {
          setMessage('');
          navigate('/form');
        }, 1500);
      }
      else {
        setMessage('Failed to upload resume ! ');
        setFile(null);
        setTimeout(() => {
          setMessage('');
        }, 1500);
      }
    }
    catch (err) {
      setMessage('Some error occured ! ');
      setFile(null);
      setTimeout(() => {
        setMessage('');
      }, 1500);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="relative w-full max-w-xl">
        <P className="absolute -top-4 left-4 bg-gray-100 px-2 text-gray-600 text-sm">
          Upload Your Resume
        </P>

        <div className="bg-white p-6 pt-10 rounded-lg shadow-md mt-2">
          <div
            className={`border-2 border-dashed ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
              } rounded-md p-10 flex flex-col items-center justify-center`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-start justify-between mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-md w-full">
                <P className="text-sm text-gray-600 break-words">
                  Selected file: <br />
                  {file.name}
                </P>
                <Svg
                  icon={X}
                  className="text-red-600 w-5 h-5 cursor-pointer mt-1"
                  onClick={() => setFile(null)}
                />
              </div>
            ) : (
              <>
                <p className="text-gray-700 font-medium mb-2">
                  Drag & Drop File to Upload
                </p>
                <span className="text-gray-500 mb-2">or</span>
                <Button
                  onClick={handleBrowseClick}
                  children="Browse"
                  className="bg-indigo-800 hover:bg-indigo-700 shadow"
                />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={triggerFileChange}
                />
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              onClick={() => setFile(null)}
              children="Cancel"
              type="back"
            />
            <Button
              children="Upload"
              onClick={uploadResume}
              type="next"
            />
          </div>
          {message && (
            <P
              children={message}
              className={`${message !== 'Resume Uploaded !' ? ('text-red-500') : ('text-green-500')} text-semibold mt-4 text-xl`}
            />
          )}

        </div>
      </div>
    </div>
  );
}
