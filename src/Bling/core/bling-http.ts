// src/Bling/Core/bling-http.ts
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
 * 🧠 Interceptor de erro compartilhado para ambos os clientes Bling
 * Exibe logs detalhados em português e mantém o stacktrace original.
 */
const logBlingError = (error: any) => {
  const url = error.config?.url;
  const status = error.response?.status;
  const message = error.response?.data || error.message;

  console.error('\n❌ Erro na comunicação com a API do Bling:');
  console.error(`🔗 URL: ${url}`);
  console.error(`📡 Código de status: ${status}`);
  console.error(`💬 Mensagem:`, message);
  console.error('----------------------------------------');

  return Promise.reject(error);
};

// Aplica o interceptor em ambos os clientes
blingCatalogHttp.interceptors.response.use((res) => res, logBlingError);
blingSalesHttp.interceptors.response.use((res) => res, logBlingError);

/*
🗓 24/10/2025 - 22:00
✨ Melhoria: interceptores de erro adicionados com logs descritivos.
--------------------------------------------
📘 Lógica:
- Centraliza a criação dos clientes HTTP do Bling (catálogo e vendas).
- Adiciona interceptores padronizados com mensagens em português.
- Facilita o rastreio de erros de integração e debugging.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
