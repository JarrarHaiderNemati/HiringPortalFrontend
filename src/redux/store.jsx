import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import candidateReducer from './candidateSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidateReducer
  },
});
