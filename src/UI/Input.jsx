export default function Input({ placeholder='', className='', value='', onChange=(()=>{}), type = '' }) {
  return (
    <input
      type={type}
      value={value}
      className={className}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}