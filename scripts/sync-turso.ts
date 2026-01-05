
import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual .env parsing
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const [key, ...values] = line.split("=");
        if (key && values.length > 0) {
            const val = values.join("=").trim();
            // Remove quotes if present
            process.env[key.trim()] = val.replace(/^["'](.*)["']$/, "$1");
        }
    });
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.replace(/ /g, '') : undefined; // Remove potentially accidentally added spaces

if (!url || !authToken) {
    console.error("Missing TURSO env vars");
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function main() {
    console.log("Generating migration SQL...");
    const sql = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script").toString();

    console.log("\n=== Generated SQL ===");
    console.log(sql);
    console.log("=== End SQL ===\n");

    console.log("Applying SQL to Turso...");

    // Better SQL statement splitting
    // Remove comments and split by semicolon
    const lines = sql.split("\n");
    const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith("--");
    });
    const cleanedSql = cleanedLines.join("\n");
    const statements = cleanedSql.split(";").map(s => s.trim()).filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (!stmt) continue; // Skip if undefined
        try {
            console.log(`[${i + 1}/${statements.length}] Executing: ${stmt.substring(0, 60)}...`);
            await client.execute(stmt);
            console.log(`✅ Success`);
        } catch (e: any) {
            console.error(`❌ Error executing statement ${i + 1}:`);
            console.error(stmt);
            console.error(e.message || e);
            // Continue with other statements
        }
    }

    console.log("\n✅ Done!");
    client.close();
}

main();
