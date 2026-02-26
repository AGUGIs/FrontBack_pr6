import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export const api = {
  // Products CRUD
  getProducts: async () => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product) => {
    const response = await apiClient.post("/products", product);
    return response.data;
  },

  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // External APIs (Practice 3)
  getCurrencyRates: async (base = 'USD') => {
    const response = await apiClient.get(`/external/currency/${base}`);
    return response.data;
  },

  getWeather: async (city = 'Moscow') => {
    const response = await apiClient.get(`/external/weather/${city}`);
    return response.data;
  }
};