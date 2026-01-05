import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

let prisma: PrismaClient;

if (tursoUrl && tursoAuthToken) {
    console.log("Using Turso (LibSQL) Adapter");
    const libsqlClient = createClient({
        url: tursoUrl,
        authToken: tursoAuthToken,
    });
    const adapter = new PrismaLibSQL(libsqlClient);
    prisma = new PrismaClient({ adapter });
} else {
    console.log("Using Local SQLite (File)");
    prisma = new PrismaClient();
}

export { prisma };
