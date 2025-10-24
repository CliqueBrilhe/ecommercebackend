// src/Bling/Core/types/sync-result.interface.ts

/*
🗓 22/10/2025 - 15:10
Criação da interface SyncResult.
--------------------------------------------
Define o contrato de retorno padrão para sincronizações do Bling.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/

export interface SyncResult {
  createdCount: number;
  updatedCount: number;
  removedCount?: number;
  linkedCount?: number;
}
