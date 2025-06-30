export default function Input({ placeholder='', className='', value='', onChange=(()=>{}), type = '',model='' }) {
  if(model==='form') {
    return (
    <input
      type={type}
      value={value}
      className='w-full px-4 text-sm mb-4 p-2 border rounded'
      placeholder={placeholder}
      onChange={onChange}
    />
  )
  }
  if(model==='login') {
  return (
    <input
      type={type}
      value={value}
      className='w-full mb-3 p-3 caret-blue-500 border-2 font-poppins text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}

  if(model==='date') {
    return (
    <input
      type={type}
      value={value}
      className='border p-1 rounded text-sm w-[12rem]'
      placeholder={placeholder}
      onChange={onChange}
    />
  )
  }
  
}