# hello-world-and-add

This is an example of a simple MCP server built with Node.js & TypeScript.

It's based on [this blog post and YouTube Video](https://www.mikeborozdin.com/post/building-a-simple-mcp-with-nodejs).

It exposes two tools:

- `say-hello` - which says `hello world`
- `add` - adds two numbers

# Running

`yarn dev`

# Adding to Claude Desktop

Edit your Claude config so that it has.

```json
{
  "mcpServers": {
    "hello-world": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000"]
    }
  }
}
```

Claude config is located in `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS and on Windows in %APPDATA%\Claude\claude_desktop_config.json
