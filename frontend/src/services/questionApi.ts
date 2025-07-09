import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API_URL } from './InterviewerApi'
import type { Question } from '@/models/entities'

// Define a service using a base URL and expected endpoints
export const questionApi = createApi({
    reducerPath: 'question',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
    endpoints: (builder) => ({
        getQuestions: builder.query<Question[], { vacancy_SK: string }>({
            query: (payload) => ({
                url: 'vacancy-session',
                method: 'POST',
                body: {
                    "operation": "get_questions",
                    "payload": {
                        "vacancy_SK": payload.vacancy_SK
                    }
                }
            }),
            transformResponse: (response: { questions: Question[] }) => response.questions
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetQuestionsQuery } = questionApi