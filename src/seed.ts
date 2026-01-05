import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Create Admin User
    const passwordHash = await hash("admin123", 10);
    const user = await prisma.user.upsert({
        where: { email: "admin@stin.com" },
        update: {},
        create: {
            email: "admin@stin.com",
            name: "Admin STIN",
            password: passwordHash,
        },
    });
    console.log({ user });

    // Create Products
    const products = [
        { name: "Jacket Utilitas (Denim)", price: 45.0, stock: 427, sales: 12127 },
        { name: "New Balance Men's Shoes", price: 120.0, stock: 402, sales: 11721 },
        { name: "605's Black Shirt", price: 25.0, stock: 379, sales: 10972 },
        { name: "Black Hoodie Classic", price: 55.0, stock: 372, sales: 10027 },
    ];

    for (const p of products) {
        await prisma.product.create({
            data: p,
        });
    }

    // Create Dummy Orders
    // Create Dummy Orders
    await prisma.order.upsert({
        where: { id: "#A7628JK" },
        update: {},
        create: {
            id: "#A7628JK",
            customerName: "Budi Santoso",
            total: 25.0,
            status: "Delivered",
            items: {
                create: {
                    productId: 3,
                    quantity: 1,
                    price: 25.0
                }
            }
        }
    });

    await prisma.order.upsert({
        where: { id: "#S6647SD" },
        update: {},
        create: {
            id: "#S6647SD",
            customerName: "Siti Rahma",
            total: 45.0,
            status: "Completed",
            items: {
                create: {
                    productId: 1,
                    quantity: 1,
                    price: 45.0
                }
            }
        }
    });
    // Create Dummy Leads
    const statuses = [
        "Confirmed Potential",
        "Price Quotation",
        "Trial",
        "Negotiation/Review",
        "Invoice",
        "Closing",
        "Retention"
    ];

    const customers = [
        "PT Sinar Jaya", "CV Maju Bersama", "Tech Solutions Inc",
        "Global Logistics", "Alpha Retail", "Beta Corp", "Gamma Industries"
    ];

    const packages = [
        "Paket Basic", "Paket Premium", "Paket Enterprise", "Custom Solution"
    ];

    console.log("Seeding leads...");

    // Clear existing leads first (optional, but good for clean slate)
    await prisma.lead.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const randomPackage = packages[Math.floor(Math.random() * packages.length)];

        await prisma.lead.create({
            data: {
                customer: randomCustomer,
                segment: "B2B",
                packageName: randomPackage,
                status: randomStatus,
                picName: "John Doe",
                nextAction: "Follow up",
                packageDesc: "Description...",
                function: "Usage...",
            }
        });
    }
    console.log("Leads seeded.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
