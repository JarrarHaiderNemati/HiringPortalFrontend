export default function Role({ role, icon, onClick=()=>{} }) {
  return (
    <div onClick={onClick}
      className="bg-white shadow-md rounded-lg px-2 py-8 text-center hover:shadow-lg transition hover:cursor-pointer"
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <p className="text-sm font-semibold text-gray-700">{role}</p>
    </div>
  )
}