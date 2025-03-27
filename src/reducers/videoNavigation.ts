// src/reducers/videoNavigation.js
import { createSlice } from "@reduxjs/toolkit";

const videoNavigationSlice = createSlice({
  name: "videoNavigation",
  initialState: {
    videoList: [],
    currentVideoIndex: 0,
    navigationContext: null,
  },
  reducers: {
    setVideoList: (state, action) => {
      state.videoList = action.payload.videos;
      state.currentVideoIndex = action.payload.initialIndex || 0;
      state.navigationContext = action.payload.context || null;
    },
    navigateToNextVideo: (state) => {
      if (state.currentVideoIndex < state.videoList.length - 1) {
        state.currentVideoIndex += 1;
      }
    },
    navigateToPreviousVideo: (state) => {
      if (state.currentVideoIndex > 0) {
        state.currentVideoIndex -= 1;
      }
    },
    resetVideoNavigation: (state) => {
      // Only reset if no videos are present
      if (state.videoList.length === 0) {
        state.currentVideoIndex = 0;
        state.navigationContext = null;
      }
    },
  },
});

export const {
  setVideoList,
  navigateToNextVideo,
  navigateToPreviousVideo,
  resetVideoNavigation,
} = videoNavigationSlice.actions;

export default videoNavigationSlice.reducer;
