// src/Bling/utils/bling-http.ts

import axios from 'axios';
import 'dotenv/config';

/**
 * 🛍️ Cliente HTTP para o Catálogo (produtos, categorias, estoque)
 * Usa o token BLING_APP_PRODUTOS_TOKEN do .env
 */
export const blingCatalogHttp = axios.create({
  baseURL: 'https://www.bling.com.br/Api/v3',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BLING_APP_PRODUTOS_TOKEN?.trim()}`,
  },
});

/**
 * 💳 Cliente HTTP para o módulo de Vendas (pedidos, notas fiscais)
 * Usa o token BLING_APP_VENDAS_TOKEN do .env
 */
export const blingSalesHttp = axios.create({
  baseURL: 'https://www.bling.com.br/Api/v3',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BLING_APP_VENDAS_TOKEN?.trim()}`,
  },
});

/**
 * Interceptor para logar erros de resposta do Bling (compartilhado)
 */
const logBlingError = (error: any) => {
  console.error('❌ Erro na requisição ao Bling:', {
    url: error.config?.url,
    status: error.response?.status,
    message: error.response?.data || error.message,
  });
  return Promise.reject(error);
};

// Aplica o interceptor em ambos os clientes
blingCatalogHttp.interceptors.response.use((res) => res, logBlingError);
blingSalesHttp.interceptors.response.use((res) => res, logBlingError);

