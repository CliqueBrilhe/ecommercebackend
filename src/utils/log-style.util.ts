// src/Core/utils/log-style.util.ts

export const colors = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bold: '\x1b[1m',
  underline: '\x1b[4m',
  inverse: '\x1b[7m',
};

export const moduleIcons = {
  categories: '📦',
  products: '🛍️',
  orders: '🧾',
  invoices: '🪙',
  users: '👤',
  sync: '🔄',
  warning: '⚠️',
  success: '✅',
  error: '❌',
};

export function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

export function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

// ⏰ Função para formatar data/hora igual ao Nest
function formatTimestamp(): string {
  const now = new Date();
  const date = now.toLocaleDateString('pt-BR');
  const time = now.toLocaleTimeString('pt-BR');
  return `${date}, ${time}`;
}

/**
 * 💬 Log padronizado com hora, PID e módulo.
 * Exemplo:
 * [Nest] 61611  - 22/10/2025, 18:40:00     LOG [BlingSyncScheduler] 🔄 Sincronização concluída!
 */
export function styledLog(
  module: keyof typeof moduleIcons,
  message: string,
  color: keyof typeof colors = 'cyan',
) {
  const pid = process.pid;
  const timestamp = formatTimestamp();
  const icon = moduleIcons[module] || '💬';

  // simulando o formato Nest
  const prefix = `[Nest] ${pid}  - ${timestamp}`;
  const tag = `[${module}]`;

  console.log(
    `${colors[color]}${prefix}     LOG ${tag} ${icon} ${message}${colors.reset}`,
  );
}


export function logSeparator(label?: string, color: keyof typeof colors = 'brightBlack') {
  const line = '─'.repeat(65);
  const title = label ? ` ${label.toUpperCase()} ` : '';
  console.log(`\n${colors[color]}${line}${title}${line}${colors.reset}\n`);
}



/*
🗓 22/10/2025 - 18:50
✨ Atualização: logs padronizados com timestamp e formato estilo NestJS.
--------------------------------------------
📘 Lógica:
- Inclui hora e data local no formato brasileiro.
- Mostra PID e módulo entre colchetes.
- Mantém cores e ícones originais.
- Uniformiza a saída com os logs oficiais do NestJS.
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
