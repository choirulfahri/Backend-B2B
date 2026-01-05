import { prisma } from "../src/db";

async function testConnection() {
    try {
        console.log("Testing Turso connection...\n");

        // Test 1: Check if we can connect
        console.log("1. Testing database connection...");
        await prisma.$queryRaw`SELECT 1 as test`;
        console.log("✅ Connection successful!\n");

        // Test 2: List all tables
        console.log("2. Checking database tables...");
        const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
    `;
        console.log(`✅ Found ${tables.length} tables:`);
        tables.forEach((table: { name: string }) => console.log(`   - ${table.name}`));
        console.log();

        // Test 3: Count records in each table
        console.log("3. Checking table records...");
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const leadCount = await prisma.lead.count();
        const packageCount = await prisma.package.count();

        console.log(`✅ Record counts:`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Products: ${productCount}`);
        console.log(`   - Orders: ${orderCount}`);
        console.log(`   - Leads: ${leadCount}`);
        console.log(`   - Packages: ${packageCount}`);
        console.log();

        console.log("🎉 All tests passed! Turso database is working correctly.");
    } catch (error) {
        console.error("❌ Test failed:");
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
