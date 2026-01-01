export default {
  api: {
    root: import.meta.env.VITE_API_ROOT || "",
    unreachableErrorMessage:
      import.meta.env.VITE_API_UNREACHABLE_ERROR_MESSAGE ?? "No se puede comunicar con el servidor"
  },
  googleAnalyticsTrackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID,
  heartBeatTimeoutSeconds: 10
};
