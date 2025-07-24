import axios from "axios";

const API_TOKEN = process.env.VITE_API_TOKEN;

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Token ${API_TOKEN}`,
  },
});

export const getRequests = () => {
  return apiClient.get("/requests/");
};

export const getRequestsFromUrl = (url) => {
  const relativePath = url.replace("http://harf.roshan-ai.ir/api", "");
  return apiClient.get(relativePath);
};

export const transcribeUrl = (url) => {
  const payload = {
    media_urls: [url],
  };
  return apiClient.post("/transcribe_files/", payload);
};

export const transcribeAudioFile = (formData) => {
  return apiClient.post("/transcribe_files/", formData);
};

export const deleteRequest = (id) => {
  return apiClient.delete(`/requests/${id}/`);
};
