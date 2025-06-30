import { createSlice } from '@reduxjs/toolkit';

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    filtered: [],
    shortlisted: [],
    search: '',
    pageNumber: 1,
    totalCount: 0,
    fromDate: '',
    toDate: '',
    selectedCandidate: null,
    clicked: '',
    toDeleteCandidate: null,
  },
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
      state.filtered = action.payload;
    },
    setFiltered: (state, action) => {
      state.filtered = action.payload;
    },
    setShortlisted: (state, action) => {
      state.shortlisted = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    setClicked: (state, action) => {
      state.clicked = action.payload;
    },
    setToDeleteCandidate: (state, action) => {
      state.toDeleteCandidate = action.payload;
    }
  }
});

export const {
  setCandidates, setFiltered, setShortlisted, setSearch,
  setPageNumber, setTotalCount, setFromDate, setToDate,
  setSelectedCandidate,
  setClicked, setToDeleteCandidate
} = candidateSlice.actions;

export default candidateSlice.reducer;
