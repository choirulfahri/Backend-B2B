import { Elysia } from "elysia";
import { prisma } from "../db";

interface Lead {
    id: number;
    segment: string;
    customer: string;
    packageName: string;
    packageDesc: string | null;
    function: string | null;
    status: string;
    picName: string | null;
    lastContact: Date | null;
    nextAction: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const dashboardRoutes = (app: Elysia) =>
    app.group("/dashboard", (app) => {
        console.log("Registering dashboard routes...");
        return app
            .get("/ping", () => "pong")
            .get("/stats", async () => {
                const totalLeads = await prisma.lead.count();
                const potential = await prisma.lead.count({ where: { status: "Confirmed Potential" } });
                const negotiation = await prisma.lead.count({ where: { status: "Negotiation/Review" } });
                const closing = await prisma.lead.count({ where: { status: "Closing" } });

                return [
                    { title: "Total Pipeline", value: totalLeads.toLocaleString(), trend: 12, label: "leads total" },
                    { title: "Potential", value: potential.toLocaleString(), trend: 5, label: "leads masuk" },
                    { title: "Negotiation", value: negotiation.toLocaleString(), trend: 8, label: "in progress" },
                    { title: "Closing", value: closing.toLocaleString(), trend: 2, label: "closing soon" },
                ];
            })
            .get("/leads", async () => {
                const leads = await prisma.lead.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 20
                });

                return leads.map((l: any) => ({
                    id: l.id,
                    customer: l.customer,
                    segment: l.segment,
                    packageName: l.packageName,
                    packageDesc: l.packageDesc,
                    function: l.function,
                    status: l.status,
                    picName: l.picName,
                    lastContact: l.lastContact,
                    nextAction: l.nextAction,
                    stageDetails: l.stageDetails ? JSON.parse(l.stageDetails) : {},
                    email: l.email,
                    phone: l.phone,
                    createdAt: l.createdAt,
                    updatedAt: l.updatedAt
                }));
            })
            .get("/customers", async () => {
                const customers = await prisma.lead.findMany({
                    where: {
                        status: { in: ["Deal", "Closing", "Retention", "Invoice"] }
                    },
                    orderBy: { updatedAt: "desc" }
                });

                return customers.map((l: any) => ({
                    id: l.id,
                    customer: l.customer,
                    segment: l.segment,
                    packageName: l.packageName,
                    packageDesc: l.packageDesc,
                    function: l.function,
                    status: l.status,
                    picName: l.picName,
                    lastContact: l.lastContact,
                    nextAction: l.nextAction,
                    stageDetails: l.stageDetails ? JSON.parse(l.stageDetails) : {},
                    email: l.email,
                    phone: l.phone,
                    createdAt: l.createdAt,
                    updatedAt: l.updatedAt
                }));
            })
            .get("/chart", async () => {
                // Chart 1: Leads distribution by Status
                const statusCounts = await prisma.lead.groupBy({
                    by: ['status'],
                    _count: { status: true }
                });

                // Chart 2: Top Packages
                const packageCounts = await prisma.lead.groupBy({
                    by: ['packageName'],
                    _count: { packageName: true },
                    orderBy: {
                        _count: { packageName: 'desc' }
                    },
                    take: 5
                });

                return {
                    statusData: {
                        labels: statusCounts.map((s: any) => s.status),
                        datasets: [{
                            label: 'Leads Distribution',
                            data: statusCounts.map((s: any) => s._count.status),
                            backgroundColor: ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#15803d'],
                            borderWidth: 0,
                        }]
                    },
                    packageData: {
                        labels: packageCounts.map((p: any) => p.packageName),
                        datasets: [{
                            label: 'Popular Packages',
                            data: packageCounts.map((p: any) => p._count.packageName),
                            backgroundColor: '#6366f1',
                            borderRadius: 6,
                        }]
                    }
                };
            })
            .post("/leads", async ({ body }: { body: any }) => {
                const { customer, segment, packageName, packageDesc, function: func, status, picName, email, phone, nextAction, stageDetails } = body;

                const newLead = await prisma.lead.create({
                    data: {
                        customer,
                        segment,
                        packageName,
                        packageDesc,
                        function: func,
                        status,
                        picName,
                        email,
                        phone,
                        nextAction: nextAction || "-",
                        stageDetails: stageDetails ? JSON.stringify(stageDetails) : null
                    }
                });

                return { success: true, lead: newLead };
            })
            // Single Lead Operations
            .get("/leads/:id", async ({ params }: { params: { id: string } }) => {
                const id = parseInt(params.id);
                const lead: any = await prisma.lead.findUnique({ where: { id } });
                if (!lead) return { error: "Lead not found" };

                return {
                    ...lead,
                    stageDetails: lead.stageDetails ? JSON.parse(lead.stageDetails) : {}
                };
            })
            .put("/leads/:id", async ({ params, body }: { params: { id: string }, body: any }) => {
                const id = parseInt(params.id);
                const { customer, segment, packageName, packageDesc, function: func, status, picName, email, phone, nextAction, stageDetails } = body;

                const updatedLead = await prisma.lead.update({
                    where: { id },
                    data: {
                        customer,
                        segment,
                        packageName,
                        packageDesc,
                        function: func,
                        status,
                        picName,
                        email,
                        phone,
                        nextAction,
                        stageDetails: stageDetails ? JSON.stringify(stageDetails) : null
                    }
                });
                return { success: true, lead: updatedLead };
            })
            // Packages API
            .get("/packages", async () => {
                return await prisma.package.findMany({
                    include: { products: true }
                });
            })
            .post("/packages", async ({ body }: { body: any }) => {
                return await prisma.package.create({
                    data: {
                        name: body.name,
                        description: body.description,
                        price: parseFloat(body.price || "0"),
                        products: {
                            connect: body.productIds?.map((id: number) => ({ id })) || []
                        }
                    }
                });
            })
            .put("/packages/:id", async ({ params, body }: { params: { id: string }, body: any }) => {
                const id = parseInt(params.id);
                return await prisma.package.update({
                    where: { id },
                    data: {
                        name: body.name,
                        description: body.description,
                        price: parseFloat(body.price || "0"),
                        products: {
                            set: [], // Clear existing relations
                            connect: body.productIds?.map((pid: number) => ({ id: pid })) || []
                        }
                    }
                });
            })
            .delete("/packages/:id", async ({ params }: { params: { id: string } }) => {
                const id = parseInt(params.id);
                return await prisma.package.delete({ where: { id } });
            })
            // Products API
            .get("/products", async () => {
                return await prisma.product.findMany();
            })
            .post("/products", async ({ body }: { body: any }) => {
                return await prisma.product.create({
                    data: {
                        name: body.name,
                        category: body.category,
                        stock: parseInt(body.stock || "0"),
                        price: parseFloat(body.price || "0")
                    }
                });
            })
            .put("/products/:id", async ({ params, body }: { params: { id: string }, body: any }) => {
                const id = parseInt(params.id);
                return await prisma.product.update({
                    where: { id },
                    data: {
                        name: body.name,
                        category: body.category,
                        stock: parseInt(body.stock || "0"),
                        price: parseFloat(body.price || "0")
                    }
                });
            })
            .delete("/products/:id", async ({ params }: { params: { id: string } }) => {
                const id = parseInt(params.id);
                return await prisma.product.delete({ where: { id } });
            })
            // Options API for Autocomplete
            .get("/options", async () => {
                const customers = await prisma.lead.findMany({
                    select: { customer: true },
                    distinct: ['customer']
                });
                const segments = await prisma.lead.findMany({
                    select: { segment: true },
                    distinct: ['segment']
                });

                // Fetch package names from multiple sources
                const existingLeads = await prisma.lead.findMany({
                    select: { packageName: true, packageDesc: true },
                    distinct: ['packageName']
                });
                const products = await prisma.product.findMany({
                    select: { name: true, description: true }
                });
                const packages = await prisma.package.findMany({
                    select: { name: true, description: true }
                });

                // Merge and deduplicate with metadata
                const packageOptions = [
                    ...products.map((p: any) => ({ name: p.name, description: p.description, type: 'Product' })),
                    ...packages.map((p: any) => ({ name: p.name, description: p.description, type: 'Package' })),
                    ...existingLeads.map((l: any) => ({ name: l.packageName, description: l.packageDesc, type: 'History' }))
                ];

                const uniquePackageMap = new Map();
                for (const pkg of packageOptions) {
                    if (!uniquePackageMap.has(pkg.name)) {
                        uniquePackageMap.set(pkg.name, pkg);
                    } else if (pkg.type !== 'History' && uniquePackageMap.get(pkg.name).type === 'History') {
                        // Upgrade history item to real product/package if name matches
                        uniquePackageMap.set(pkg.name, pkg);
                    }
                }

                return {
                    customers: customers.map((c: { customer: string }) => c.customer),
                    segments: segments.map((s: { segment: string }) => s.segment),
                    packages: Array.from(uniquePackageMap.values()).sort((a: any, b: any) => a.name.localeCompare(b.name))
                };
            })
    });
