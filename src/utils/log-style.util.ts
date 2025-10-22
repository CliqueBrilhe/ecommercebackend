// src/Core/utils/log-style.util.ts

// 🎨 Códigos de cores ANSI
export const colors = {
  reset: '\x1b[0m',

  // Cores de texto
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Cores brilhantes
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Estilos
  bold: '\x1b[1m',
  underline: '\x1b[4m',
  inverse: '\x1b[7m',
};

// 🧩 Ícones padronizados por módulo
export const moduleIcons = {
  categories: '📦', // caixas → categorias
  products: '🛍️', // sacolas → produtos
  orders: '🧾', // nota fiscal → pedidos
  invoices: '🪙', // moedas → notas fiscais
  users: '👤', // usuário
  sync: '🔄', // sincronização geral
  warning: '⚠️',
  success: '✅',
  error: '❌',
};

// 🪄 Funções helper para aplicar cor facilmente
export function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

export function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

// 💬 Função para exibir uma mensagem padronizada de log
export function styledLog(
  module: keyof typeof moduleIcons,
  message: string,
  color: keyof typeof colors = 'cyan',
) {
  const icon = moduleIcons[module] || '💬';
  console.log(`${colors[color]}${icon} ${message}${colors.reset}`);
}



/*
📘 Exemplos de uso:

import { colors, styledLog, moduleIcons } from 'src/Core/utils/log-style.util';

// cores diretas:
console.log(`${colors.green}✅ Sucesso!${colors.reset}`);
console.log(`${colors.red}❌ Erro crítico${colors.reset}`);

// estilo com helper:
styledLog('products', 'Produtos sincronizados com sucesso!', 'green');
styledLog('categories', 'Categorias atualizadas.', 'cyan');
styledLog('sync', 'Execução finalizada.', 'brightMagenta');
*/


/*
🗓 22/10/2025 - 16:05
✨ Criação: utilitário de estilo para logs coloridos e padronizados.
--------------------------------------------
📘 Lógica:
Define cores ANSI e ícones por módulo do sistema, permitindo criar logs
visuais e consistentes em todos os serviços (Bling, Sync, Produtos, etc).
Inclui funções helper para aplicar cor e reset automático.
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/