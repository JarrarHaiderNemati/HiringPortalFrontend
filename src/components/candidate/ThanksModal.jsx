import { Check, X } from "lucide-react";
import Svg from "../../UI/Svg";
import H1 from "../../UI/H1";
import P from "../../UI/P";
import { useNavigate } from "react-router-dom";

export default function ThanksModal({submitted}) {
  if(!submitted) {
    return null;
  }
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/submitted');
  };

  return (
    <div className="relative bg-thanksColor text-white px-16 py-12 rounded-xl text-center shadow-2xl max-w-md w-full">
      <div className="absolute top-4 right-4 cursor-pointer">
        <Svg icon={X} className="text-white w-5 h-5 hover:text-gray-300" onClick={handleClose} />
      </div>

      <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Svg icon={Check} className="text-gray-800 w-10 h-10" />
      </div>

      <H1 className="text-4xl font-bold mb-3">Thank You</H1>
      <P className="text-lg">The form was submitted successfully</P>
    </div>
  );
}
