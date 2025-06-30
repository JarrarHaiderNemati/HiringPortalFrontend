export default function Button({ children, className = '', onClick = () => { }, type = '',isReceived=false }) {
  if (type === 'next') {
    return (
      <button
        onClick={onClick}
        className={`bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition duration-150`}
      >
        {children}
      </button>
    )
  }

  if (type === 'back') {
    return (
      <button onClick={onClick}
        className="bg-gray-500 hover:bg-gray-400 px-8 py-2 border rounded text-white transition duration-150"
      >
        {children}
      </button>
    )
  }

  if(type==='admin') {
    return (
      <button onClick={onClick}
        className="bg-gray-200 font-semibold px-4 py-2 rounded text-sm disabled:bg-gray-300"
      >
        {children}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition duration-150 ${className}`}
    >
      {children}
    </button>
  )
}