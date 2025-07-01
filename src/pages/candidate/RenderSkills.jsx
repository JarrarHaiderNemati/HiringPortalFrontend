export default function Renderskills() {
  const values = ["Python", "C++", "Angular", "React", "JavaScript"];

  return (
    <>
      {values.map(element => (
        <option key={element} value={element}>
          {element}
        </option>
      ))}
    </>
  );
}
