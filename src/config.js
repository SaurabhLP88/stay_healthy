/* const API_URL = window.location.hostname === "localhost" ? "http://localhost:8181" : "http://localhost:8181";
console.log(
    "API_URL :",
    API_URL
);*/

export const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://stayhealthy-api.onrender.com");

console.log("API_URL:", API_URL);