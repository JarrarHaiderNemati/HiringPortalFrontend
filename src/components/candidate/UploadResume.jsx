import { useRef, useState } from "react";
import P from "../../UI/P";
import Button from "../../UI/Button";
import { X } from "lucide-react";
import Svg from "../../UI/Svg";

export default function Uploadresume() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const triggerFileChange = (e) => {
    if (!e.target.files[0]) return;
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="relative w-full max-w-xl">
        {/* Floating Label */}
        <P className="absolute -top-4 left-4 bg-gray-100 px-2 text-gray-600 text-sm">
          Upload Your Resume
        </P>

        <div className="bg-white p-6 pt-10 rounded-lg shadow-md mt-2">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-10 flex flex-col items-center justify-center">
            {/* Dropzone or Selected File Info */}
            {file ? (
              <div className="flex items-start justify-between mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-md">
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
                <p className="text-gray-700 font-medium mb-2">Drag & Drop File to Upload</p>
                <span className="text-gray-500 mb-2">or</span>
                <Button
                  onClick={handleBrowseClick}
                  children="Browse"
                  className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
                />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={triggerFileChange}
                />
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              onClick={() => setFile(null)}
              children="Cancel"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
            />
            <Button
              children="Upload"
              className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
