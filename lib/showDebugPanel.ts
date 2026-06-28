export const showDebugPanel =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_SHOW_DEBUG === "true";
