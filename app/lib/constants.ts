export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://publicaciones.vercel.app"
    : "http://localhost:3000";
