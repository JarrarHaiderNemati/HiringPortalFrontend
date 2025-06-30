import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  role: '',
  message: '',
  checking: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setChecking: (state, action) => {
      state.checking = action.payload;
    },
    resetAuthFields: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setField, setMessage, setChecking, resetAuthFields } = authSlice.actions;
export default authSlice.reducer;
