import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from './InterviewerApi';
import type { Question, Vacancy } from '@/models/entities';

// Define a service using a base URL and expected endpoints
export const vacancyApi = createApi({
  reducerPath: 'vacancyAPI',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  tagTypes: ['Vacancy', 'VacancyList', 'VacancyQuestions'],
  endpoints: (builder) => ({
    getVacancies: builder.query<Vacancy[], void>({
      query: () => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'get_vacancies',
          payload: {},
        },
      }),
      transformResponse: (response: { vacancies: Vacancy[] }) => response.vacancies,
      providesTags: ['VacancyList'],
    }),
    getVacancyBySK: builder.query<Vacancy, { vacancySK: string }>({
      query: (payload) => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'get_vacancy',
          payload: {
            vacancy_SK: payload.vacancySK,
          },
        },
      }),
      transformResponse: (response: { vacancy: Vacancy }) => response.vacancy,
      providesTags: (result) => (result ? [{ type: 'Vacancy', id: result.SK }] : []),
    }),
    getQuestions: builder.query<Question[], { vacancySK: string }>({
      query: (payload) => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'get_questions',
          payload: {
            vacancy_SK: payload.vacancySK,
          },
        },
      }),
      transformResponse: (response: { questions: Question[] }) => response.questions,
      // @ts-ignore
      providesTags: (result, error, payload) =>
        result ? [{ type: 'VacancyQuestions', id: payload.vacancySK }] : [],
    }),
    answerQuestion: builder.mutation<
      void,
      { vacancySK: string; questionSK: string; answer: string }
    >({
      query: (payload) => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'answer_question',
          payload: {
            vacancy_SK: payload.vacancySK,
            question_SK: payload.questionSK,
            answer: payload.answer,
          },
        },
      }),
      // @ts-ignore
      invalidatesTags: (result, error, arg) => [
        { type: 'VacancyQuestions', id: arg.vacancySK }, // оновлення питань
        { type: 'Vacancy', id: arg.vacancySK }, // оновлення однієї вакансії
        'VacancyList', // оновлення списку вакансій
      ],
    }),
    addVacancy: builder.mutation<
      {
        item: { vacancy_SK: string };
      },
      { title: string; url?: string; skills: string[] }
    >({
      query: (payload) => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'create_vacancy',
          payload: {
            title: payload.title,
            skills: payload.skills,
            url: payload.url,
          },
        },
      }),
      // @ts-ignore
      invalidatesTags: (result, error, arg) => [
        'VacancyList', // оновлення списку вакансій
      ],
    }),
    removeVacancy: builder.mutation<void, { vacancySK: string }>({
      query: (payload) => ({
        url: 'vacancy-session',
        method: 'POST',
        body: {
          operation: 'remove_vacancy',
          payload: {
            vacancy_SK: payload.vacancySK,
          },
        },
      }),
      // @ts-ignore
      invalidatesTags: (result, error, arg) => [
        'VacancyList', // оновлення списку вакансій
        { type: 'VacancyQuestions', id: arg.vacancySK }, // оновлення питань
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVacanciesQuery,
  useGetVacancyBySKQuery,
  useAnswerQuestionMutation,
  useGetQuestionsQuery,
  useAddVacancyMutation,
} = vacancyApi;
