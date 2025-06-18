import {
  MonitorSmartphone,
  Code2,
  Laptop,
  Smartphone
} from "lucide-react";

const Roles = [
  { title: "UI/UX DESIGNER", icon: <MonitorSmartphone size={40} className="text-indigo-700" /> },
  { title: "FRONT-END DEVELOPER", icon: <Laptop size={40} className="text-indigo-700" /> },
  { title: "FULL-STACK DEVELOPER", icon: <Code2 size={40} className="text-indigo-700" /> },
  { title: "IOS DEVELOPER", icon: <Smartphone size={40} className="text-indigo-700" /> },
]

export default Roles;