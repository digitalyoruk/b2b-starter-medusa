import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: {
    [COMPANY_MODULE]: {
      resolve: "./modules/company",
    },
    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },
    [APPROVAL_MODULE]: {
      resolve: "./modules/approval",
    },
    [Modules.CACHE]: {
      resolve: process.env.NODE_ENV === "production" 
        ? "@medusajs/medusa/cache-redis"
        : "@medusajs/medusa/cache-inmemory",
      options: process.env.NODE_ENV === "production" ? {
        redisUrl: process.env.REDIS_URL,
      } : undefined,
    },
    [Modules.EVENT_BUS]: {
      resolve: process.env.NODE_ENV === "production"
        ? "@medusajs/medusa/event-bus-redis"
        : "@medusajs/medusa/event-bus-local",
      options: process.env.NODE_ENV === "production" ? {
        redisUrl: process.env.REDIS_URL,
      } : undefined,
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: process.env.NODE_ENV === "production"
        ? "@medusajs/medusa/workflow-engine-redis"
        : "@medusajs/medusa/workflow-engine-inmemory",
      options: process.env.NODE_ENV === "production" ? {
        redis: {
          url: process.env.REDIS_URL,
        },
      } : undefined,
    },
  },
});
