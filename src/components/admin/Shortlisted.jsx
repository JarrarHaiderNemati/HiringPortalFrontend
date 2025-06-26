import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { Download, Trash2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Svg from '../../UI/Svg';
import ShowInfo from './ShowInfo';
import Confmodal from '../../UI/Confmodal';
import { useNavigate } from 'react-router-dom';
import StatusCodes from '../../../SCODES';
import LINK from '../../BackendLink';

export default function Shortlisted() {
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [info, setInfo] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clicked, setClicked] = useState('');
  const [toDeleteCandidate, setToDeleteCandidate] = useState(null);
  const [toDate,setTodate]=useState('');
  const [fromDate,setFromdate]=useState('');

  const navigate = useNavigate();

  const nicheColors = {
    'FULL-STACK DEVELOPER': '#3B82F6',
    'FRONT-END DEVELOPER': '#F97316',
    'UI/UX DESIGN': '#EF4444',
    'IOS DEVELOPER': '#FACC15',
  };

  useEffect(() => { fetchShortlisted(); }, []);
  useEffect(() => {
    const res = candidates.filter(
      c =>
        c.name.toLowerCase().startsWith(search.toLowerCase().trim()) ||
        c.niche.toLowerCase().startsWith(search.toLowerCase().trim())
    );
    setFiltered(res);
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

  const fetchShortlisted = async () => {
    try {
      const resp = await axios.get(`${LINK}/fetchShortlisted`, {
        validateStatus: () => true,
      });
      if (resp.data.status === StatusCodes.SUCCESS) setCandidates(resp.data.candidates);
      else setCandidates([]);
    } catch (err) {
      setCandidates([]);
      alert('Some error occurred!');
    }
  };

  const deleteCandidate = async candidate => {
    const prev = structuredClone(candidates);
    setCandidates(c => c.filter(e => e.email !== candidate.email));
    try {
      const resp = await axios.delete(`${LINK}/deleteCandidate`, {
        data: { email: candidate.email },
        validateStatus: () => true,
      });
      if (resp.data.status !== StatusCodes.SUCCESS) setCandidates(prev);
    } catch (err) {
      setCandidates(prev);
      alert('Error deleting!');
    }
  };

  const deleteAll = async () => {
    const prev = structuredClone(candidates);
    setCandidates([]);
    try {
      const resp = await axios.delete(`${LINK}/deleteAll`, {
        data: { status: 'Shortlisted' },
        validateStatus: () => true,
      });
      if (resp.data.status !== StatusCodes.SUCCESS) setCandidates(prev);
    } catch (err) {
      setCandidates(prev);
      alert('Error deleting all!');
    }
  };

  const chartData = (() => {
    if (!candidates.length) return [];
    const counts = {};
    candidates.forEach(c => {
      const key = c.niche?.trim().toUpperCase() || 'UNKNOWN';
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = candidates.length;
    return Object.entries(counts).map(([name, cnt]) => ({
      name,
      value: ((cnt / total) * 100).toFixed(2),
    }));
  })();

  const downloadAll = async () => {
    window.open(`${LINK}/downloadAll`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Tabs */}
      <div className="flex space-x-6 border-b pb-2 mb-6">
        <button onClick={() => navigate('/recieved')} className="text-gray-500">
          Received
        </button>
        <button className="text-indigo-800 font-semibold border-b-2 border-indigo-800 pb-1">
          Short Listed
        </button>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center mb-8">
        <BarChart width={400} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={v => `${v}%`} allowDecimals={false} />
          <Tooltip formatter={v => `${v}%`} />
          <Legend />
          <Bar dataKey="value" barSize={20}>
            {chartData.map((e, i) => (
              <Cell key={i} fill={nicheColors[e.name.toUpperCase()] || '#A3A3A3'} />
            ))}
          </Bar>
        </BarChart>

        <ul className="ml-0 lg:ml-8 mt-6 lg:mt-0 space-y-2 text-sm">
          <li><span className="inline-block w-3 h-3 bg-blue-500 mr-2 rounded-sm" />Full Stack Developer</li>
          <li><span className="inline-block w-3 h-3 bg-orange-500 mr-2 rounded-sm" />Front-end Developer</li>
          <li><span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded-sm" />UI/UX Design</li>
          <li><span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded-sm" />iOS Developer</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            disabled={!candidates.length}
            onClick={downloadAll}
            className="bg-gray-200 font-semibold px-4 py-1 rounded text-sm disabled:bg-gray-300"
          >
            Download All
          </button>
          <button
            disabled={!candidates.length}
            onClick={() => { setClicked('All'); setShowConfirmModal(true); }}
            className="bg-gray-200 font-semibold px-4 py-1 rounded text-sm disabled:bg-gray-300"
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
              placeholder="Name/Domain…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="p-1 text-sm outline-none flex-1"
            />
            <Svg icon={Search} className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-[800px] w-full border text-sm">
            <thead className="bg-indigo-800 text-white">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Discipline</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Resume</th>
                <th className="px-3 py-2">Info</th>
                <th className="px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.map((c, i) => (
                <tr key={i} className={`border-b ${i % 2===0?('bg-white'):('bg-gray-100')}`}>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">{c.name}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">{c.email}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">{c.contact}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">{c.niche}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center">
                      <a href={`${LINK}/${c.file}`} target="_blank">
                        <Download className="text-indigo-800 w-6 h-6" />
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => {
                          setSelectedCandidate(c);
                          setInfo(true);
                        }}
                        className="text-indigo-800 underline"
                      >
                        Show Info
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center">
                      <Svg
                        icon={Trash2}
                        className="text-indigo-800 w-6 h-6 cursor-pointer"
                        onClick={() => {
                          setClicked('One');
                          setToDeleteCandidate(c);
                          setShowConfirmModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="bg-indigo-600 text-white px-4 py-2 rounded text-center">
          {search ? 'No results found.' : 'No candidates found!'}
        </p>
      )}

          <ShowInfo info={info} candidate={selectedCandidate} onClose={() => setInfo(false)} />

        <Confmodal
        showConfirmModal={showConfirmModal}
          title={
            clicked === 'One'
              ? 'Are you sure you want to delete this candidate?'
              : 'Are you sure you want to delete ALL shortlisted candidates?'
          }
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            if (clicked === 'One' && toDeleteCandidate) deleteCandidate(toDeleteCandidate);
            else deleteAll();
            setShowConfirmModal(false);
          }}
        />
    </div>
  );
}
