import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Download, Trash2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Svg from '../../UI/Svg';
import ShowInfo from './ShowInfo';
import Confmodal from '../../UI/Confmodal';
import { useNavigate } from 'react-router-dom';
import LINK from '../../BackendLink';
import StatusCodes from '../../../SCODES';

export default function Recieved() {
  const [candidates, setCandidates] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [info, setInfo] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clicked, setClicked] = useState('');
  const [toDeleteCandidate, setToDelete] = useState(null);
  const [toDate,setTodate]=useState('');
  const [fromDate,setFromdate]=useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecieved();
  }, []);

  useEffect(() => {
    const results = candidates.filter(c =>
      c.name.toLowerCase().startsWith(search.toLowerCase().trim()) ||
      c.niche.toLowerCase().startsWith(search.toLowerCase().trim())
    );
    setFiltered(results);
  }, [search, candidates]);

  useEffect(() => {
  if (fromDate && toDate) {

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const res = candidates.filter(c => {
      const created = new Date(c.createdAt);
      
      const createdOnly = new Date(created.getFullYear(), created.getMonth(), created.getDate());
      const fromOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const toOnly = new Date(to.getFullYear(), to.getMonth(), to.getDate());

      return createdOnly >= fromOnly && createdOnly <= toOnly;
    });

    setFiltered(res);
  } else {
    setFiltered(candidates);
  }
}, [fromDate, toDate, candidates]);

  const fetchRecieved = async () => {
    try {
      const { data } = await axios.get(`${LINK}/fetchRecieved`, {
        validateStatus: () => true
      });
      if (data.status === StatusCodes.SUCCESS) {
        setCandidates(data.candidates);
        setFiltered(data.candidates);
      } else setCandidates([]);
    } catch {
      setCandidates([]);
      alert('Some error occurred!');
    }
  };

  const addShortListed = (e, cand) => {
    setShortlisted(prev =>
      e.target.checked ? [...prev, cand.email] : prev.filter(i => i !== cand.email)
    );
  };

  const shortListCnds = async () => {
    if (!shortlisted.length) return alert('No candidates selected!');
    const previous = structuredClone(candidates);
    setCandidates(prev => prev.filter(c => !shortlisted.includes(c.email)));
    setShortlisted([]);
    try {
      await Promise.all(shortlisted.map(email =>
        axios.post(`${LINK}/shortlistCnds`, { email })
      ));
    } catch {
      setCandidates(previous);
      alert('Short-listing failed!');
    }
  };

  const deleteCandidate = async cand => {
    const previous = structuredClone(candidates);
    setCandidates(prev => prev.filter(c => c.email !== cand.email));
    try {
      const { data } = await axios.delete(`${LINK}/deleteCandidate`, {
        data: { email: cand.email }, validateStatus: () => true
      });
      if (data.status !== StatusCodes.SUCCESS) setCandidates(previous);
    } catch {
      setCandidates(previous);
      alert('Delete failed!');
    }
  };

  const getChartData = () => {
    const counts = {};
    candidates.forEach(c => {
      const key = c.niche?.trim() || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const deleteAll = async () => {
    const previous = structuredClone(candidates);
    setCandidates([]);
    try {
      const { data } = await axios.delete(`${LINK}/deleteAll`, {
        data: { status: 'Recieved' }, validateStatus: () => true
      });
      if (data.status !== StatusCodes.SUCCESS) setCandidates(previous);
    } catch {
      setCandidates(previous);
      alert('Delete-all failed!');
    } finally {
      setShowConfirmModal(false);
    }
  };

  const downloadAll = () =>
    window.open(`${LINK}/downloadAll`, '_blank');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Tabs */}
      <div className="flex space-x-6 border-b pb-2 mb-6">
        <button className="text-indigo-800 font-semibold border-b-2 border-indigo-800 pb-1">
          Received
        </button>
        <button
          onClick={() => navigate('/shortlisted')}
          className="text-gray-500"
        >
          Short Listed
        </button>
      </div>

      {/* Pie Chart */}
      <div className="flex flex-col lg:flex-row items-center justify-center mb-8">
        <PieChart width={250} height={250}>
          <Pie
            data={getChartData()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {getChartData().map((_, i) => (
              <Cell
                key={i}
                fill={['#3B82F6', '#F97316', '#EF4444', '#FACC15'][i % 4]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <ul className="ml-0 lg:ml-8 mt-6 lg:mt-0 space-y-2 text-sm">
          <li><span className="inline-block w-3 h-3 bg-blue-500 mr-2 rounded-sm" />Full Stack Developer</li>
          <li><span className="inline-block w-3 h-3 bg-orange-500 mr-2 rounded-sm" />Front-end Developer</li>
          <li><span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded-sm" />UI/UX Design</li>
          <li><span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded-sm" />iOS Developer</li>
        </ul>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            disabled={!candidates.length}
            onClick={downloadAll}
            className="bg-gray-200 font-semibold px-4 py-1 rounded text-sm disabled:bg-gray-300 disabled:text-gray-500"
          >
            Download All
          </button>
          <button
            disabled={!candidates.length}
            onClick={() => { setClicked('All'); setShowConfirmModal(true); }}
            className="bg-gray-200 font-semibold px-4 py-1 rounded text-sm disabled:bg-gray-300 disabled:text-gray-500"
          >
            Delete All
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className='flex gap-2 items-center'>
            <p className='font-semibold'>From</p>
            <input onChange={(e)=>setFromdate(e.target.value)} value={fromDate} type="date" className="border p-1 rounded text-sm w-[12rem] cursor-pointer" />
          </div>

          <div className='flex gap-2 items-center'>
            <p className='font-semibold'>To</p>
            <input onChange={(e)=>setTodate(e.target.value)} value={toDate} type="date" className="border p-1 rounded text-sm w-[12rem] cursor-pointer" />
          </div>
          <div className="flex items-center border rounded px-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Name/Domain..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="p-1 text-sm outline-none flex-1"
            />
            <Svg icon={Search} className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
        <Confmodal
          showConfirmModal={showConfirmModal}
          title={
            clicked === 'One'
              ? 'Are you sure you want to delete this candidate?'
              : 'Are you sure you want to delete all candidates?'
          }
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() =>
            clicked === 'One' && toDeleteCandidate
              ? deleteCandidate(toDeleteCandidate)
              : deleteAll()
          }
        />

      {/* Table */}
      {filtered.length ? (
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse border text-sm">
            <thead className="bg-indigo-800 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Shortlist</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Discipline</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-center">Resume</th>
                <th className="px-4 py-2 text-center">Info</th>
                <th className="px-4 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.map((c, i) => (
                <tr key={i} className={`border-b ${i % 2===0?('bg-white'):('bg-gray-100')}`}>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={shortlisted.includes(c.email)}
                      onChange={e => addShortListed(e, c)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2 text-left">{c.name}</td>
                  <td className="px-4 py-2 text-left">{c.email}</td>
                  <td className="px-4 py-2 text-left">{c.contact}</td>
                  <td className="px-4 py-2 text-left">{c.niche}</td>
                  <td className="px-4 py-2 text-left">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <a href={`${LINK}/${c.file}`} target="_blank">
                        <Download className="text-indigo-800 w-5 h-5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => { setSelectedCandidate(c); setInfo(true); }}
                      className="text-indigo-800 underline"
                    >
                      Show Info
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <Svg
                        icon={Trash2}
                        onClick={() => { setClicked('One'); setToDelete(c); setShowConfirmModal(true); }}
                        className="text-indigo-800 w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              onClick={shortListCnds}
              className="bg-indigo-800 text-white px-6 py-1 rounded text-sm"
            >
              Short List
            </button>
          </div>
        </div>
      ) : (
        <p className="bg-indigo-600 text-white px-4 py-2 rounded">
          No candidates found!
        </p>
      )}
            <ShowInfo info={info} candidate={selectedCandidate} onClose={() => setInfo(false)} />
    </div>
  );
}
