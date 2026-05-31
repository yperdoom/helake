# Helake — Gestão de Confeitaria

Painel de gestão para confeitaria artesanal: encomendas, ingredientes, receitas, clientes e controle financeiro.

Stack: Vue 3 (Options API) + Vite + Vercel Functions + MongoDB Atlas

---

## Pré-requisitos

- Node.js >= 20
- Yarn
- Vercel CLI: `npm i -g vercel`
- Conta no [MongoDB Atlas](https://cloud.mongodb.com) (M0 free tier)
- Conta na [Vercel](https://vercel.com)

---

## Configuração inicial

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repo>
cd helake
yarn install
```

### 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto (nunca commitar este arquivo):

```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=qualquer-string-longa-e-aleatoria
```

**Atenção:** se a senha do Atlas tiver caracteres especiais (`@`, `#`, `!`, `%`, etc.), eles precisam ser URL-encoded. Exemplo: `@` vira `%40`, `#` vira `%23`.

Para evitar esse problema, crie um usuário no Atlas com senha apenas alfanumérica.

### 3. Vincular ao projeto Vercel

```bash
vercel link
```

Se as variáveis já estiverem configuradas no Vercel, puxe para o `.env.local`:

```bash
vercel env pull .env.local
```

---

## Rodar localmente

```bash
yarn local
```

Isso executa `vercel dev` com as variáveis do `.env.local`. O frontend fica em `http://localhost:3000`.

---

## Criar o primeiro usuário (setup único)

Após o banco conectar com sucesso, crie o usuário administrador:

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"suasenha"}'
```

Este endpoint se auto-bloqueia após o primeiro uso — não é possível criar um segundo usuário por ele.

---

## Deploy

```bash
vercel --prod
```

As variáveis de ambiente (`MONGODB_URI`, `JWT_SECRET`) precisam estar configuradas no painel da Vercel em **Settings → Environment Variables**.

---

## Estrutura do projeto

```
helake/
├── api/                    # Vercel Functions (serverless)
│   ├── auth/
│   │   ├── login.js        # POST /api/auth/login
│   │   └── setup.js        # POST /api/auth/setup (primeiro usuário)
│   ├── lib/
│   │   ├── auth.js         # JWT helpers
│   │   ├── db.js           # Conexão MongoDB singleton
│   │   └── models/         # Schemas Mongoose
│   ├── ingredients.js      # GET, POST /api/ingredients
│   ├── ingredients/[id].js # PUT, DELETE /api/ingredients/:id
│   ├── recipes.js
│   ├── recipes/[id].js
│   ├── orders.js
│   ├── orders/[id].js
│   ├── customers.js
│   ├── customers/[id].js
│   ├── settings.js
│   └── dashboard.js
├── src/
│   ├── pages/              # Uma pasta por página: .vue + .js + .module.css
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Ingredients/
│   │   ├── Recipes/
│   │   ├── Orders/
│   │   ├── Customers/
│   │   └── Settings/
│   └── router/
├── vercel.json             # SPA rewrite rules
└── vite.config.js
```

---

## Troubleshooting

### `bad auth: authentication failed` no MongoDB

1. No Atlas, vá em **Database Access** e redefina a senha do usuário
2. Use apenas letras e números na senha (sem caracteres especiais)
3. Atualize o `MONGODB_URI` no `.env.local` e no painel da Vercel
4. Rode `vercel env pull .env.local` para sincronizar

### `vercel dev` recursivo

Nunca coloque `vercel dev` dentro do script `dev` do `package.json`. A separação correta é:
- `"dev": "vite"` — usado internamente pelo vercel dev
- `"local": "dotenv -e .env.local -- vercel dev"` — o que você roda

### Variáveis de ambiente não carregadas

Sempre rode via `yarn local`, não `vercel dev` diretamente — o `dotenv-cli` é necessário para injetar o `.env.local`.
