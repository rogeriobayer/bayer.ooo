# Decap CMS OAuth Proxy para bayer.ooo

Cloudflare Worker que atua como proxy de autenticação OAuth entre o DecapCMS e o GitHub.

## Por que isso é necessário?

O DecapCMS usa por padrão o serviço de auth da Netlify (`api.netlify.com/auth`).
Este serviço **não funciona** para sites hospedados fora da Netlify (como Cloudflare Pages).
Este worker resolve esse problema implementando o fluxo OAuth diretamente.

## Deploy

### 1. Criar GitHub OAuth App

1. Acesse: https://github.com/settings/developers
2. Novo OAuth App:
   - **Homepage URL**: URL deste worker (ex: `https://bayerooo-decap-auth.seu-account.workers.dev`)
   - **Authorization callback URL**: URL do worker + `/callback`
3. Anote o **Client ID** e **Client Secret**

### 2. Configurar secrets

```bash
cd workers/decap-auth
npx wrangler secret put GITHUB_OAUTH_ID      # Cole o Client ID
npx wrangler secret put GITHUB_OAUTH_SECRET  # Cole o Client Secret
```

### 3. Deploy

```bash
npx wrangler deploy
```

### 4. Atualizar config.yml

Edite `public/admin/config.yml` e atualize `base_url` para a URL do worker deployado.

## Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `/` | Health check |
| `/auth?provider=github` | Inicia o fluxo OAuth com GitHub |
| `/callback?provider=github&code=...` | Recebe o callback do GitHub e troca o code por token |
