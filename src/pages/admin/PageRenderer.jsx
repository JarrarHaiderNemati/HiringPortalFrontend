export default function PageRenderer({ count, limit, setPageNumber,pageNumber }) {
  const totalPages = Math.ceil(count / limit);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => setPageNumber(i)}
        className={`${i===pageNumber?('bg-green-500'):('bg-gray-200')} px-3 py-1 border rounded mx-1`}
      >
        {i}
      </button>
    );
  }

  return <div className="mt-4 flex justify-center">{pages}</div>;
}
