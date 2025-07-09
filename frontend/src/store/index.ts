import { questionApi } from '@/services/questionApi'
import { vacancyApi } from '@/services/vacancyApi'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        [vacancyApi.reducerPath]: vacancyApi.reducer,
        [questionApi.reducerPath]: questionApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(vacancyApi.middleware)
            .concat(questionApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch