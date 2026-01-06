import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";

const app = new Elysia()
  .use(cors({
    origin: (request) => {
      const origin = request.headers.get('origin');
      // Allow localhost for development
      if (origin?.includes('localhost')) return true;
      // Allow Vercel deployments
      if (origin?.includes('vercel.app')) return true;
      return false;
    },
    credentials: true
  }))
  .use(swagger())
  .get("/", () => ({ message: "Hello from STIN Dashboard API!" }))
  .use(authRoutes)
  .use(dashboardRoutes);

// For Vercel serverless
export default app;

// For local dev
if (import.meta.main) {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
