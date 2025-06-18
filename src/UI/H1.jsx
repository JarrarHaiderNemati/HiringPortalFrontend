export default function H1({ children, className = '' }) {
  return (
    <h1 className={`text-4xl font-bold ${className}`}>
      {children}
    </h1>
  );
}
