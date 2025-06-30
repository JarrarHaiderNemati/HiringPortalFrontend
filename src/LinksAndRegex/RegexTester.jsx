export default function RegexTester(key,value) {
  if(key==='email') {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }
  else if(key==='phone') {
    const regex=/^\d+$/;
    return regex.test(value);
  }
}