import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API_URL } from './InterviewerApi'
import type { Vacancy } from '@/models/entities'

// Define a service using a base URL and expected endpoints
export const vacancyApi = createApi({
    reducerPath: 'vacancy',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
    endpoints: (builder) => ({
        getVacancies: builder.query<Vacancy[], void>({
            query: () => ({
                url: 'vacancy-session',
                method: 'POST',
                body: {
                    "operation": "get_vacancies",
                    "payload": {}
                }
            }),
            transformResponse: (response: { vacancies: Vacancy[] }) => response.vacancies
        }),
        getVacancyBySK: builder.query<Vacancy, {vacancySK: string}>({
            query: (payload) => ({
                url: 'vacancy-session',
                method: 'POST',
                body: {
                    "operation": "get_vacancy",
                    "payload": {
                        "vacancy_SK": payload.vacancySK
                    }
                }
            }),
            transformResponse: (response: { vacancy: Vacancy }) => response.vacancy
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVacanciesQuery, useGetVacancyBySKQuery } = vacancyApi