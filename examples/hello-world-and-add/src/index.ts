import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const server = new McpServer({
      name: "hello-world",
      version: "1.0.0",
    });

    server.registerTool(
      "say-hello-world",
      {
        title: "Say hello",
        description: "Says hello to the world",
      },
      () => {
        return {
          content: [{ type: "text", text: "Hello, world!" }],
        };
      }
    );

    server.registerTool(
      "add",
      {
        title: "Add two numbers",
        description: "Adds two numbers",
        // Strongly typed input schema
        inputSchema: {
          a: z.number().describe("The first number"),
          b: z.number().describe("The second number"),
        },
      },
      (input) => {
        return {
          content: [{ type: "text", text: `${input.a + input.b}` }],
        };
      }
    );

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

app.listen(3000);
