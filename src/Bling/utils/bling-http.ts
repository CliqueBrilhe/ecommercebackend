// src/Bling/utils/bling-http.ts

import axios from 'axios';
import 'dotenv/config';


export const blingHttp = axios.create({
  baseURL: 'https://www.bling.com.br/Api/v3', // URL base da API v3 do Bling
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BLING_ACCESS_TOKEN?.trim()}`, // Token salvo no .env
  },
});

// Interceptor para logar erros de resposta do Bling
blingHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Erro na requisição ao Bling:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    return Promise.reject(error);
  },
);

