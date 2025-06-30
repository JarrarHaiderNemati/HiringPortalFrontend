export default function Svg({icon:Icon,className,onClick=()=>{}}) {
  return(
    <Icon onClick={onClick} className={className}/>
  )
}