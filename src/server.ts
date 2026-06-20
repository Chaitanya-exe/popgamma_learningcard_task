import Fastify, {type FastifyInstance, type RouteShorthandOptions} from "fastify";
import fastifyCors from "@fastify/cors";
import register_routes from "./routes.js";
import { GeminiService } from "./llm_service.js";
import dotenv from 'dotenv';

dotenv.config()

const server: FastifyInstance = Fastify({
    logger: {
        level: "debug",
    }
});

server.register(fastifyCors, {
    origin: true,
    credentials: true
})

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("No api key found.");
    process.exit(1);
}

const geminiService = new GeminiService(apiKey);
await register_routes(server, geminiService);

try{
    await server.listen({port:8000});
    const address = server.server.address();
    const port = typeof address === "string" ? address: address?.port

} catch(err) {
    server.log.error(err);
    process.exit(1);
}
