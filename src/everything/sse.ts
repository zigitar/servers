import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { createServer } from "./everything.js";
import { addAuthEndpoints, AuthConfig } from "./auth.js";

const app = express();

const { server, cleanup } = createServer();

// Configure auth
const authConfig: AuthConfig = {
  enabled: process.env.ENABLE_AUTH === 'true'
};

// Add auth endpoints if enabled
addAuthEndpoints(app, authConfig);

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  console.log("Received connection");
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);

  server.onclose = async () => {
    await cleanup();
    await server.close();
    process.exit(0);
  };
});

app.post("/message", async (req, res) => {
  console.log("Received message");

  await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
