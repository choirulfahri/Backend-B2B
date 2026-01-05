import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Ensure Admin User Exists
    const passwordHash = await hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@stin.com" },
        update: {},
        create: {
            email: "admin@stin.com",
            name: "Admin STIN",
            password: passwordHash,
        },
    });

    // Clear existing Leads to avoid duplicates on re-seed
    // Seed Products
    const products = [
        { name: "Parfum Essence Oud", category: "Raw Material", stock: 5000, price: 500000 },
        { name: "Botol Kaca 50ml Premium", category: "Packaging", stock: 1000, price: 15000 },
        { name: "Botol Kaca 12ml Roll-on", category: "Packaging", stock: 2000, price: 8000 },
        { name: "Hardbox Custom Logo", category: "Packaging", stock: 500, price: 25000 },
        { name: "Reed Diffuser Stick", category: "Accessories", stock: 10000, price: 500 },
        { name: "Base Diffuser Oil", category: "Raw Material", stock: 100000, price: 200 },
        { name: "Linen Spray Bottle 100ml", category: "Packaging", stock: 1500, price: 12000 },
        { name: "Kartu Ucapan Gold Foil", category: "Printing", stock: 1000, price: 3000 }
    ];

    for (const p of products) {
        await prisma.product.create({ data: p });
    }

    // Seed Packages
    const packages = [
        { name: "Paket Sultan VIP", description: "Parfum Oud 12ml + Hardbox + Sajadah", price: 1500000 },
        { name: "Corporate Gift Basic", description: "Parfum 30ml + Box Logo", price: 150000 },
        { name: "Corporate Gift Premium", description: "Diffuser 50ml + Scented Candle + Hardbox", price: 350000 },
        { name: "Hotel Amenities Set", description: "Shampoo + Soap + Lotion (Custom Scent)", price: 45000 },
        { name: "Wedding Souvenir Mini", description: "Parfum 5ml Card", price: 15000 },
        { name: "Linen Spray Bulk", description: "Jerrycan 5L for Professional Use", price: 450000 },
        { name: "Showroom Ambiance Kit", description: "Diffuser Machine + 2L Oil", price: 2500000 }
    ];

    for (const pkg of packages) {
        await prisma.package.create({ data: pkg });
    }

    const leads = [
        { segment: "Travel Umroh", customer: "Sultan Tours", packageName: "Paket Sultan VIP", packageDesc: "Parfum oud 12ml, sajadah custom", function: "Souvenir VIP", status: "Potensi Cuan", picName: "Haji Ahmad", nextAction: "Kirim tester oud" },
        { segment: "Hotel Bintang 5", customer: "Royal Heritage Hotel", packageName: "Lobby Signature Scent", packageDesc: "Diffuser system & refill 5L", function: "Branding Aroma", status: "Kontak", picName: "Bu Sarah (GM)", nextAction: "Jadwal visit lokasi" },
        { segment: "Startup Unicorn", customer: "TechJaya Corp", packageName: "Onboarding Kit", packageDesc: "Linen spray, hand sanitizer custom", function: "Employee Welcome", status: "List Dalam", picName: "VP HR", nextAction: "Finalisasi desain box" },
        { segment: "Instansi Pemerintah", customer: "Kementerian BUMN", packageName: "G20 Exclusive Gift", packageDesc: "Parfum rempah nusantara", function: "Souvenir Delegasi", status: "Potensi Cuan", picName: "Pak Hartono", nextAction: "Ikut tender" },
        { segment: "Automotive", customer: "Supercar Community", packageName: "Car Leather Scent", packageDesc: "Leather spray premium", function: "Member Gift", status: "List Dalam", picName: "Ketua Komunitas", nextAction: "Kirim penawaran final" },
        { segment: "Wedding Organizer", customer: "Luxury Weddings", packageName: "Resepsi Souvenir", packageDesc: "Mini 2ml cards", function: "Souvenir Tamu", status: "Kontak", picName: "Mba Tiara", nextAction: "Demo produk di kantor" },
        { segment: "Maskapai", customer: "Sky High Air", packageName: "First Class Amenity", packageDesc: "Set relaksasi (spray + oil)", function: "In-flight Service", status: "Negotiation", picName: "Procurement Head", nextAction: "Negosiasi termin bayar" },
        { segment: "Bank Swasta", customer: "Bank Central Asia", packageName: "Prioritas Gift", packageDesc: "Diffuser keramik", function: "Nasabah Prioritas", status: "Deal", picName: "Area Manager", nextAction: "Kontrak & PO" },
        { segment: "Oil & Gas", customer: "Shell Indonesia", packageName: "Safety Month Kit", packageDesc: "Hand sanitizer & soap custom", function: "Internal Event", status: "Deal", picName: "HSE Manager", nextAction: "Repeat Order" },
        { segment: "Telecommunications", customer: "Telkomsel", packageName: "High Value User Gift", packageDesc: "Reed Diffuser 50ml", function: "Loyalty Program", status: "Deal", picName: "Head of Loyalty", nextAction: "Pengiriman Batch 2" },
        { segment: "Insurance", customer: "Prudential", packageName: "Agent Reward", packageDesc: "Parfum 30ml Exclusive", function: "Agency Event", status: "Deal", picName: "Agency Director", nextAction: "Invoice Pelunasan" },
        { segment: "FMCG", customer: "Indofood", packageName: "Visitor Souvenir", packageDesc: "Linen spray 60ml", function: "Pabrik Visit", status: "Deal", picName: "PR Manager", nextAction: "Restock Q3" },
        { segment: "Coffee Shop Chain", customer: "Kopi Senja Utama", packageName: "Merchandise Series", packageDesc: "Parfum aroma kopi", function: "Retail Product", status: "Potensi Cuan", picName: "Head Barista", nextAction: "Brainstorm varian wangi" },
        { segment: "Rumah Sakit", customer: "RS Medika Sehat", packageName: "Calming Room Spray", packageDesc: "Lavender & Eucalyptus", function: "Ruang VIP", status: "List Dalam", picName: "Direktur Umum", nextAction: "Trial satu lantai" },
        { segment: "Real Estate", customer: "Green Living Residence", packageName: "Marketing Gallery Scent", packageDesc: "Green tea scent machine", function: "Sales Experience", status: "Kontak", picName: "Marketing Director", nextAction: "Instalasi demo" }
    ];

    for (const lead of leads) {
        await prisma.lead.create({
            data: lead,
        });
    }

    console.log(`Seeded ${leads.length} leads.`);
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
