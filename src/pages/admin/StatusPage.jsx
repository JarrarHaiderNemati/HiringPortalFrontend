import {
  PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';
import { Download, Trash2, Search } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import Svg from '@components/UI/Svg';
import Button from '@components/UI/Button';
import ShowInfo from './ShowInfo';
import Confmodal from '@components/UI/Confmodal';
import { useNavigate } from 'react-router-dom';
import URLS from 'LinksAndRegex/Endpoints';
import StatusCodes from 'LinksAndRegex/SCODES';
import columns from './Columns';
import PageRenderer from './PageRenderer';
import Input from '@components/UI/Input';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCandidates, setFiltered, setShortlisted, setSearch,
  setPageNumber, setTotalCount, setFromDate, setToDate,
  setSelectedCandidate, setClicked, setToDeleteCandidate
} from '@redux/candidateSlice';
import colors from './PieChartcolors';
import nicheColors from './NicheColors';
import DEFAULT_COLOR from './DefaultColor';

export default function StatusPage({ status }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isReceived = status === 'Recieved';

  const {
    candidates, shortlisted, filtered, search,
    fromDate, toDate, pageNumber, totalCount,
    selectedCandidate, clicked, toDeleteCandidate
  } = useSelector(state => state.candidates);

  useEffect(() => {
    dispatch(setCandidates([]));
    fetchCandidates();
    fetchTotal();
  }, [status, pageNumber]);

  useEffect(() => {
    const result = candidates.filter(c =>
      c.name.toLowerCase().startsWith(search.toLowerCase().trim()) ||
      c.niche.toLowerCase().startsWith(search.toLowerCase().trim())
    );
    dispatch(setFiltered(result));
  }, [search, candidates]);

  useEffect(() => {
    if (fromDate && toDate) {
      const from = dayjs(fromDate).startOf('day');
      const to = dayjs(toDate).endOf('day');
      const res = candidates.filter(c => {
        const created = dayjs(c.createdAt);
        return created.isAfter(from.subtract(1, 'ms')) && created.isBefore(to.add(1, 'ms'));
      });
      dispatch(setFiltered(res));
    } else {
      dispatch(setFiltered(candidates));
    }
  }, [fromDate, toDate, candidates]);

  const fetchCandidates = async () => {
    try {
      const { data } = await axios.get(`${URLS.PAGINATION}?page=${pageNumber}&limit=5&status=${status}`);
      if (data.status === StatusCodes.SUCCESS) {
        dispatch(setCandidates(data.candidates));
      } else dispatch(setCandidates([]));
    } catch {
      dispatch(setCandidates([]));
      alert('Error loading data!');
    }
  };

  const fetchTotal = async () => {
    try {
      const { data } = await axios.get(`${URLS.FETCH_COUNT}?status=${status}`);
      if (data.status === StatusCodes.SUCCESS) {
        dispatch(setTotalCount(data.count));
      }
    } catch {
      alert('Error fetching total count!');
    }
  };

  const downloadAll = () => window.open(URLS.DOWNLOAD_ALL, '_blank');

  const deleteCandidate = async cand => {
    const previous = structuredClone(candidates);
    dispatch(setCandidates(candidates.filter(c => c.email !== cand.email)));
    try {
      const res = await axios.delete(URLS.DELETE_CAND, {
        data: { email: cand.email }, validateStatus: () => true
      });
      if (res.data.status !== StatusCodes.SUCCESS) dispatch(setCandidates(previous));
    } catch {
      dispatch(setCandidates(previous));
      alert('Delete failed!');
    }
  };

  const deleteAll = async () => {
    const prev = structuredClone(candidates);
    dispatch(setCandidates([]));
    try {
      const res = await axios.delete(URLS.DELETE_ALL, {
        data: { status }, validateStatus: () => true
      });
      if (res.data.status !== StatusCodes.SUCCESS) dispatch(setCandidates(prev));
    } catch {
      dispatch(setCandidates(prev));
      alert('Delete-all failed!');
    }
  };

  const shortListCnds = async () => {
    if (!shortlisted.length) return alert('No candidates selected!');
    const previous = structuredClone(candidates);
    dispatch(setCandidates(candidates.filter(c => !shortlisted.includes(c.email))));
    dispatch(setShortlisted([]));
    try {
      await Promise.all(shortlisted.map(email => axios.post(URLS.SHORTLIST, { email })));
    } catch {
      dispatch(setCandidates(previous));
      alert('Short-listing failed!');
    }
  };

  const triggerModal = (type) => {
    window.dispatchEvent(new CustomEvent('showConf', {
      detail: {
        title: type === 'One'
          ? 'Are you sure you want to delete this candidate?'
          : `Are you sure you want to delete ALL ${status.toLowerCase()} candidates?`,
        onConfirm: () => {
          if (clicked === 'One' && toDeleteCandidate) deleteCandidate(toDeleteCandidate);
          else deleteAll();
        }
      }
    }));
  };

  const triggerInfo = (cand) => {
    window.dispatchEvent(new CustomEvent('showInfo', {
      detail: { candidate: cand }
    }));
  };

  const getChartData = () => {
    const counts = {};
    candidates.forEach(c => {
      const key = c.niche?.trim().toUpperCase() || 'UNKNOWN';
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = candidates.length;
    return Object.entries(counts).map(([name, cnt]) => ({
      name,
      value: isReceived ? cnt : ((cnt / total) * 100).toFixed(2)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="flex space-x-6 border-b pb-2 mb-6">
        <button isReceived={isReceived} className={`pb-1 ${isReceived ? 'text-indigo-800 font-semibold border-b-2 border-indigo-800' : 'text-gray-500'}`} onClick={() => navigate('/recieved')}>Received</button>
        <button className={`pb-1 ${!isReceived ? 'text-indigo-800 font-semibold border-b-2 border-indigo-800' : 'text-gray-500'}`} onClick={() => navigate('/shortlisted')}>Short Listed</button>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center mb-8">
        {isReceived ? (
          <PieChart width={250} height={250}>
            <Pie data={getChartData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {getChartData().map((_, i) => (
                <Cell key={i} fill={[colors.color1, colors.color2, colors.color3, colors.color4][i % 4]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <BarChart width={400} height={250} data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={v => `${v}%`} allowDecimals={false} />
            <Tooltip formatter={v => `${v}%`} />
            <Legend />
            <Bar dataKey="value" barSize={20}>
              {getChartData().map((e, i) => (
                <Cell key={i} fill={nicheColors[e.name] || DEFAULT_COLOR} />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadAll} disabled={!candidates.length} type='admin'>Download All</Button>
          <Button onClick={() => { dispatch(setClicked('All')); triggerModal('All'); }} disabled={!candidates.length} type='admin'>Delete All</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <p className="font-semibold">From</p>
            <Input type="date" value={fromDate} onChange={e => dispatch(setFromDate(e.target.value))} model='date' />
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">To</p>
            <Input type="date" value={toDate} onChange={e => dispatch(setToDate(e.target.value))} model='date' />
          </div>
          <div className="flex items-center border rounded px-2">
            <input type="text" placeholder="Name/Domain..." value={search} onChange={e => dispatch(setSearch(e.target.value))} className="p-1 text-sm outline-none flex-1" />
            <Svg icon={Search} className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      <Confmodal />

      {filtered.length ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-[800px] w-full border text-sm">
            <thead className="bg-indigo-800 text-white">
              <tr>
                {columns.map((col, i) =>
                  (isReceived || col.label !== 'Shortlist') && (
                    <th key={i} className={`px-3 py-2 text-${col.align || 'center'}`}>{col.label}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.map((c, i) => (
                <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                  {columns.map((col, index) => {
                    const val = c[col.key];
                    switch (col.key) {
                      case 'checkbox':
                        return isReceived ? (
                          <td key={index} className="text-center px-3 py-2">
                            <input type="checkbox" checked={shortlisted.includes(c.email)} onChange={e => {
                              const updated = e.target.checked
                                ? [...shortlisted, c.email]
                                : shortlisted.filter(i => i !== c.email);
                              dispatch(setShortlisted(updated));
                            }} />
                          </td>
                        ) : null;
                      case 'createdAt':
                        return <td key={index} className="text-center px-3 py-2">{dayjs(val).format('YYYY-MM-DD')}</td>;
                      case 'resume':
                        return <td key={index} className="text-center px-3 py-2"><a href={`${URLS.UPLOADS}/${c.file.replace('uploads/', '')}`} target="_blank"><Svg icon={Download} className="text-indigo-800 w-5 h-5 mx-auto" /></a></td>;
                      case 'info':
                        return <td key={index} className="text-center px-3 py-2"><button onClick={() => { dispatch(setSelectedCandidate(c)); triggerInfo(c); }} className="text-indigo-800 underline">Show Info</button></td>;
                      case 'delete':
                        return <td key={index} className="text-center px-3 py-2"><Svg icon={Trash2} className="text-indigo-800 w-5 h-5 cursor-pointer mx-auto" onClick={() => { dispatch(setClicked('One')); dispatch(setToDeleteCandidate(c)); triggerModal('One'); }} /></td>;
                      default:
                        return <td key={index} className={`px-3 py-2 text-${col.align || 'center'}`}>{val}</td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {isReceived && (
            <div className="mt-4">
              <Button onClick={shortListCnds} type='next'>Short List</Button>
            </div>
          )}
        </div>
      ) : (
        <p className="bg-indigo-600 text-white px-4 py-2 rounded text-center">
          {search ? 'No results found.' : 'No candidates found!'}
        </p>
      )}

      <ShowInfo />
      <PageRenderer pageNumber={pageNumber} setPageNumber={num => dispatch(setPageNumber(num))} count={totalCount} limit={5} />
    </div>
  );
}
