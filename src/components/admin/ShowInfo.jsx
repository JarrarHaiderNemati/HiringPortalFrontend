export default function ShowInfo({ candidate, onClose,info }) {
  if (!candidate) return null;
  if(!info) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-200 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-semibold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Personal Info */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Personal Info</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="font-medium text-gray-600">Name:</div>
            <div className="text-gray-800">{candidate.name}</div>

            <div className="font-medium text-gray-600">Contact No:</div>
            <div className="text-gray-800">{candidate.contact}</div>

            <div className="font-medium text-gray-600">Email:</div>
            <div className="text-gray-800">{candidate.email}</div>

            <div className="font-medium text-gray-600">Current Address:</div>
            <div className="text-gray-800">{candidate.address}</div>
          </div>
        </section>

        {/* Educational Background */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Educational Background</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="font-medium text-gray-600">Discipline:</div>
            <div className="text-gray-800">{candidate.discipline}</div>

            <div className="font-medium text-gray-600">Graduation Year:</div>
            <div className="text-gray-800">{candidate.graduation}</div>

            <div className="font-medium text-gray-600">University:</div>
            <div className="text-gray-800">{candidate.university}</div>
          </div>
        </section>

        {/* Technical Background */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Technical Background</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="font-medium text-gray-600">Languages You Have Worked With:</div>
            <div className="text-gray-800">
              {candidate.progLanguages?.length
                ? candidate.progLanguages.join(", ")
                : "Not provided"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
