<img src="files_readme/banners (1).png" alt="Banner escrito backend" />

## Sumário
1. [Objetivos e Finalidade](#objetivo-e-finalidade)
2. [Descrição do Produto](#descricao-do-produto)
3. [Entregas](#entregas)
4. [Tecnologias](#tecnologias)
5. [Funcionalidades](#funcionalidades)
6. [Instalação](#instalacao)
7. [Estrutura](#estrutura)
8. []

---

# Objetivos e Finalidade

# Descrição do Produto



<div align=center>

<h2> Contribuidores</h2>

<a href="https://github.com/CliqueBrilhe/ecommercebackend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CliqueBrilhe/ecommercebackend" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

</div>



```
clique-e-brilhe-backend/
├── dist/                         # Código compilado para produção (gerado automaticamente)
├── node_modules/                 # Dependências do projeto (gerado automaticamente)
│
├── src/                          # É aqui que toda a mágica acontece!
│   │
│   ├── main.ts                   # Arquivo principal que inicia a aplicação
│   ├── app.module.ts               # Módulo raiz da aplicação
│   │
│   ├── config/                   # Configurações (ex: banco de dados, env vars)
│   │   └── typeorm.config.ts
│   │
│   ├── common/                   # Código compartilhado por vários módulos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── decorators/
│   │   └── guards/
│   │
│   ├── auth/                     # Módulo de Autenticação (login, jwt, etc)
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   │
│   ├── users/                    # Módulo de Usuários
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── products/                 # Módulo de Produtos
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── entities/
│   │   │   └── product.entity.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   └── carts/                    # Módulo de Carrinhos
│       ├── ... (mesma estrutura dos outros módulos)
│
├── .env                          # Arquivo para variáveis de ambiente (NÃO ENVIE PARA O GIT!)
├── .eslintrc.js                  # Configurações do Linter (padrão de código)
├── .gitignore                    # Arquivos a serem ignorados pelo Git
├── nest-cli.json                 # Configurações do NestJS CLI
├── package.json                  # Dependências e scripts do projeto
├── tsconfig.build.json           # Configurações do TypeScript para o build
└── tsconfig.json                 # Configurações do TypeScript para o desenvolvimento
```
