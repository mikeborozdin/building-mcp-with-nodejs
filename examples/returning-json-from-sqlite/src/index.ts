import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import Database from "better-sqlite3";
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
      name: "wine-mcp",
      version: "1.0.0",
    });

    server.registerTool(
      "list-wines",
      {
        title: "list all wines we're selling",
        description: "list all wines we're selling",
        outputSchema: {
          wineList: z.array(
            z.object({
              id: z.string().describe("The id of the wine"),
              name: z.string().describe("The name of the wine"),
            })
          ),
        },
      },
      async () => {
        const db = new Database("./data/wine.db");

        const wineList = db.prepare("SELECT id, name FROM wine").all();

        return {
          // for back compatibility
          content: [
            {
              type: "text",
              text: JSON.stringify({ wineList }),
            },
          ],
          structuredContent: { wineList },
        };
      }
    );

    server.registerTool(
      "get-wine-by-id",
      {
        title: "Gets a wine by id including sales data",
        description: "Gets a wine by id including sales data",
        inputSchema: {
          id: z.string().describe("The id of the wine"),
        },
        outputSchema: {
          id: z.string().describe("The id of the wine"),
          name: z.string().describe("The name of the wine"),
          type: z.string().describe("The type of the wine"),
          price: z.number().describe("The price of the wine"),
          sales: z.number().describe("The sales of the wine"),
        },
      },
      async (input) => {
        const db = new Database("./data/wine.db");

        const wine = db
          .prepare(
            `SELECT 
              wine.*
              ,SUM(orders.quantity * wine.price) as sales
              FROM
                 wine 
              LEFT JOIN 
                orders 
                  ON
                    wine.id = orders.wine_id 
              WHERE wine.id = ?
              GROUP BY wine.id`
          )
          .get(input.id) as {
          id: string;
          name: string;
          type: string;
          price: number;
          sales: number;
        };

        return {
          // for back compatibility
          content: [
            {
              type: "text",
              text: JSON.stringify(wine),
            },
          ],
          structuredContent: wine,
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

app.listen(3001);
