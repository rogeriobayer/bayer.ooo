/**
 * Cloudflare Worker - OAuth Proxy para DecapCMS
 * Baseado em https://github.com/sterlingwes/decap-proxy
 *
 * Este worker elimina a dependência do serviço de auth da Netlify,
 * permitindo usar DecapCMS com GitHub em qualquer host (Cloudflare, Vercel, etc).
 */

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function createAuthorizeURL(clientId, redirectUri, scope, state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    state: state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

async function exchangeCodeForToken(clientId, clientSecret, code, redirectUri) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const json = await response.json();
  return json.access_token;
}

function callbackScriptResponse(status, token) {
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Decap CMS Auth</title>
  <script>
    (function() {
      function receiveMessage(message) {
        window.opener.postMessage(
          'authorization:github:${status}:' + JSON.stringify({ token: ${JSON.stringify(token)} }),
          '*'
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</head>
<body>
  <p>Autorizando Decap CMS...</p>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function handleAuth(url, env) {
  const provider = url.searchParams.get("provider");
  if (provider !== "github") {
    return new Response("Provedor inválido. Use ?provider=github", { status: 400 });
  }

  const repoIsPrivate = env.GITHUB_REPO_PRIVATE != null && env.GITHUB_REPO_PRIVATE !== "0";
  const scope = repoIsPrivate ? "repo,user" : "public_repo,user";
  const redirectUri = `https://${url.hostname}/callback?provider=github`;

  const authorizationUri = createAuthorizeURL(
    env.GITHUB_OAUTH_ID,
    redirectUri,
    scope,
    randomHex(4)
  );

  return new Response(null, {
    headers: { location: authorizationUri },
    status: 302,
  });
}

async function handleCallback(url, env) {
  const provider = url.searchParams.get("provider");
  if (provider !== "github") {
    return new Response("Provedor inválido", { status: 400 });
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Código de autorização ausente", { status: 400 });
  }

  const redirectUri = `https://${url.hostname}/callback?provider=github`;

  try {
    const accessToken = await exchangeCodeForToken(
      env.GITHUB_OAUTH_ID,
      env.GITHUB_OAUTH_SECRET,
      code,
      redirectUri
    );
    return callbackScriptResponse("success", accessToken);
  } catch (error) {
    console.error("Erro ao trocar code por token:", error);
    return new Response("Falha na autenticação com GitHub", { status: 500 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }

    if (url.pathname === "/callback") {
      return handleCallback(url, env);
    }

    return new Response(
      "Decap CMS OAuth Proxy está rodando. Use /auth para iniciar a autenticação.",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  },
};
