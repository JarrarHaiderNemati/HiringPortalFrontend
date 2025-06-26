export default function P({children,className,onClick=()=>{}}) {
  return(
    <p onClick={onClick} className={className}>{children}</p>
  )
}