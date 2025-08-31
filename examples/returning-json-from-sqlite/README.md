# returning-json-from-sqlite

This is an example of a simple MCP server built with Node.js & TypeScript.

It returns data from a SQL database

It's based on [this blog post and YouTube Video](https://www.mikeborozdin.com/post/building-a-simple-mcp-with-nodejs).

It exposes two tools:

- `list-wine` - gives a list of all wine
- `get-wine-by-id` - gets a specific wine

# Running

`yarn dev`

# Adding to Claude Desktop

Edit your Claude config so that it has.

```json
{
  "mcpServers": {
    "wine-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3001"]
    }
  }
}
```

Claude config is located in `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS and on Windows in %APPDATA%\Claude\claude_desktop_config.json
