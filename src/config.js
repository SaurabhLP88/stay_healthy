/* const API_URL = window.location.hostname === "localhost" ? "http://localhost:8181" : "http://localhost:8181";
console.log(
    "API_URL :",
    API_URL
);*/

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_URL = isLocalhost
  ? "http://localhost:8181"
  : "https://stayhealthy-api.onrender.com";

console.log("API_URL:", API_URL);