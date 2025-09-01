import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import http from "http";
import bodyParser from "body-parser";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { typeDefs } from "../graphql/schema.js";
import { resolvers, pubsub, EVENTS } from "../graphql/resolvers.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI environment variable not set.");
    process.exit(1);
  }
  await connectDB(process.env.MONGO_URI);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const httpServer = http.createServer(app);

  // WebSocket for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema }, wsServer);

  // Apollo Server
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  // Fix: Use expressMiddleware correctly for Apollo Server v4
  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(apolloServer)
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Apollo Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🔌 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
};

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
