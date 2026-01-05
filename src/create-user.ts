import { prisma } from "./db";
import Bun from "bun";

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log("Usage: bun src/create-user.ts <name> <email> <password>");
        process.exit(1);
    }

    const [name, email, password] = args;

    console.log(`Creating user: ${name} (${email})...`);

    try {
        const passwordHash = await Bun.password.hash(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });
        console.log(`✅ User created successfully:`);
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
    } catch (e: any) {
        if (e.code === 'P2002') {
            console.error("❌ Error: A user with this email already exists.");
        } else {
            console.error("❌ Error creating user:", e);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
