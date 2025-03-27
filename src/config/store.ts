import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../reducers/authentication";
import usersReducer from "../reducers/users";
import competitionsReducer from "../reducers/competitions";
import submissionsReducer from "../reducers/submissions";
import videoPosts from "../reducers/videoPosts";
import videoNavigationReducer from "../reducers/videoNavigation";

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    users: usersReducer,
    competitions: competitionsReducer,
    submissions: submissionsReducer,
    videoPosts: videoPosts,
    videoNavigation: videoNavigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for complex actions
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
