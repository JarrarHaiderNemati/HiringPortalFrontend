import Svg from "../../UI/Svg";

export default function Techstackrender({ icon, title, onClick }) {
  return (
    <div
      key={title}
      className="bg-gray-200 px-3 rounded text-xs flex items-center gap-1"
    >
      <span className="text-gray-700">{title}</span>
      <Svg
        icon={icon}
        className="text-gray-800 text-[10px] cursor-pointer hover:text-red-600"
        onClick={onClick}
      />
    </div>
  );
}
