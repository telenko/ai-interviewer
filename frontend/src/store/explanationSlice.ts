import InterviewerApi from '@/services/InterviewerApi';
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '.';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

interface ExplanationState {
  explanationByQuestionSK: Record<string, string>;
  loadingByQuestionSK: Record<string, boolean>;
  errorByQuestionSK: Record<string, string | null>;
}

const initialState: ExplanationState = {
  explanationByQuestionSK: {},
  loadingByQuestionSK: {},
  errorByQuestionSK: {},
};

// 🧠 Async thunk
export const fetchExplanation = createAsyncThunk<
  { questionSK: string; explanation: string },
  { questionSK: string; vacancySK: string }
>('explanation/fetch', async ({ questionSK, vacancySK }, thunkAPI) => {
  try {
    const cachedExplanation = (thunkAPI.getState() as RootState).explanation
      .explanationByQuestionSK[questionSK];
    if (cachedExplanation) {
      // not allowing to explain twice as for now
      return {
        questionSK: questionSK,
        explanation: cachedExplanation,
      };
    }
    const res = await InterviewerApi.post<any, { data: { explanation: string } }>(
      '/vacancy-session',
      {
        operation: 'explain',
        payload: {
          question_SK: questionSK,
          vacancy_SK: vacancySK,
        },
      },
    );

    return { questionSK: questionSK, explanation: res.data.explanation };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({ questionSK, error: err.message });
  }
});

export const explanationSlice = createSlice({
  name: 'explanation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExplanation.pending, (state, action) => {
        const { questionSK } = action.meta.arg;
        state.loadingByQuestionSK[questionSK] = true;
        state.errorByQuestionSK[questionSK] = null;
      })
      .addCase(fetchExplanation.fulfilled, (state, action) => {
        const { questionSK, explanation } = action.payload;
        state.explanationByQuestionSK[questionSK] = explanation;
        state.loadingByQuestionSK[questionSK] = false;
        state.errorByQuestionSK[questionSK] = null;
      })
      .addCase(fetchExplanation.rejected, (state, action: any) => {
        const { questionSK, error } = action.payload;
        state.loadingByQuestionSK[questionSK] = false;
        state.errorByQuestionSK[questionSK] = error || 'Unknown error';
      });
  },
});

export default explanationSlice.reducer;

export const makeSelectExplanationBySK = (sk?: string) =>
  createSelector(
    (state: RootState) => state.explanation.explanationByQuestionSK[sk ?? ''] ?? '',
    (state: RootState) => state.explanation.loadingByQuestionSK[sk ?? ''] ?? false,
    (state: RootState) => state.explanation.errorByQuestionSK[sk ?? ''] ?? '',
    (explanation, loading, error) => ({
      explanation,
      loading,
      error,
    }),
  );
type ExplanationQuery = { explanation: string; loading: boolean; error?: string | null };
export const useExplanation = (questionSK?: string): ExplanationQuery => {
  const selectExplanation = useMemo(() => makeSelectExplanationBySK(questionSK), [questionSK]);
  return useSelector(selectExplanation);
};
