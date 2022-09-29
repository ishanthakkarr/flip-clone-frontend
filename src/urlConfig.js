const baseUrl = window.location.hostname === "localhost" ? "http://localhost:2000" : "https://flipkart-rest-server-backend.herokuapp.com";

export const generatePublicUrl = (fileName) => {
    return `${baseUrl}/public/${fileName}`
}

// const baseUrl = "https://flipkart-rest-server.herokuapp.com";
const baseUrl = window.location.hostname === "localhost" ? "http://localhost:2000" : "https://flipkart-rest-server-backend.herokuapp.com";

export const api = `${baseUrl}/api`;
export const generatePublicUrl = (fileName) => {
  return `${baseUrl}/public/${fileName}`;
};