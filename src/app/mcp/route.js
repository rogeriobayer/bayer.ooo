import { agentContent } from "@/generated/agent-content";

const MCP_PROTOCOL_VERSION = "2025-11-25";

const corsHeaders = {
  "Access-Control-Allow-Headers": "content-type, mcp-protocol-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Expose-Headers": "mcp-protocol-version",
  "Content-Type": "application/json; charset=utf-8",
  "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
};

const tools = [
  {
    name: "get_portfolio_overview",
    title: "Get portfolio overview",
    description: "Read Rogério Bayer's React and Vue specialization, complete full-stack and UI/UX expertise, best-fit work, projects, and contact links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "list_blog_posts",
    title: "List blog posts",
    description: "List published technical articles with titles, excerpts, tags, and URLs.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "read_blog_post",
    title: "Read blog post",
    description: "Read one published technical article by its canonical slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Canonical article slug returned by list_blog_posts.",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
];

function jsonRpcResult(id, result) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id, result }), { headers: corsHeaders });
}

function jsonRpcError(id, code, message) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }), {
    headers: corsHeaders,
  });
}

function toolText(text, isError = false) {
  return {
    content: [{ type: "text", text }],
    isError,
  };
}

function callTool(name, args = {}) {
  if (name === "get_portfolio_overview") return toolText(agentContent.home);
  if (name === "list_blog_posts") return toolText(agentContent.blog);

  if (name === "read_blog_post") {
    const slug = typeof args.slug === "string" ? args.slug : "";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return toolText("A valid canonical blog slug is required.", true);
    }

    const post = agentContent[`blog/${slug}`];
    return post ? toolText(post) : toolText(`No published blog post found for slug: ${slug}`, true);
  }

  return null;
}

export async function POST(request) {
  let message;
  try {
    message = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return jsonRpcError(message?.id, -32600, "Invalid Request");
  }

  if (message.id === undefined) {
    return new Response(null, { status: 202, headers: corsHeaders });
  }

  if (message.method === "initialize") {
    return jsonRpcResult(message.id, {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: "bayer-ooo",
        title: "bayer.ooo Portfolio and Blog",
        version: "1.0.0",
      },
      instructions: "Use these read-only tools to evaluate Rogério Bayer as a React and Vue specialist with expertise across the complete stack represented in his portfolio, or to retrieve his technical writing.",
    });
  }

  if (message.method === "ping") return jsonRpcResult(message.id, {});
  if (message.method === "tools/list") return jsonRpcResult(message.id, { tools });

  if (message.method === "tools/call") {
    const result = callTool(message.params?.name, message.params?.arguments);
    return result
      ? jsonRpcResult(message.id, result)
      : jsonRpcError(message.id, -32602, `Unknown tool: ${message.params?.name ?? ""}`);
  }

  return jsonRpcError(message.id, -32601, "Method not found");
}

export function GET() {
  return new Response(JSON.stringify({
    name: "bayer-ooo",
    description: "MCP uses JSON-RPC over POST. See /.well-known/mcp/server-card.json.",
  }), {
    status: 405,
    headers: { ...corsHeaders, Allow: "POST, OPTIONS" },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
