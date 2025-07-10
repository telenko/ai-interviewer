import { vacancyApi } from '@/services/vacancyApi';
import { configureStore } from '@reduxjs/toolkit';
import { explanationSlice } from './explanationSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    [vacancyApi.reducerPath]: vacancyApi.reducer,
    [explanationSlice.name]: explanationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(vacancyApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
