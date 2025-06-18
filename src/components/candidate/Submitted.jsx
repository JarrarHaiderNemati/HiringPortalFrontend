export default function Submitted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-2">Thank You!</h1>
        <p className="text-gray-700 text-lg">Your form has been successfully submitted.</p>
      </div>
    </div>
  );
}
