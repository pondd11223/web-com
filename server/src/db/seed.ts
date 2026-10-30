import { db, client } from "./index";
import { admins, categories, services, settings, pageContents, messages } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting computer store database seeding...");

  // 1. Create Default Admin
  const adminEmail = "admin@nexuspc.co.th";
  const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail)).limit(1);

  if (existingAdmin.length === 0) {
    const hashedPassword = await Bun.password.hash("admin123456", {
      algorithm: "bcrypt",
      cost: 10,
    });

    await db.insert(admins).values({
      email: adminEmail,
      password: hashedPassword,
      name: "Nexus Tech Administrator",
    });
    console.log("✅ Admin created: admin@nexuspc.co.th / admin123456");
  } else {
    console.log("ℹ️ Admin already exists");
  }

  // 2. Clear old services & categories to cleanly re-seed computer store data
  await db.delete(services);
  await db.delete(categories);
  await db.delete(pageContents);
  await db.delete(settings);
  await db.delete(messages);
  console.log("🧹 Cleaned old tables for fresh computer store data");

  // 3. Create Categories
  const categoryData = [
    {
      name: "Custom Gaming PC",
      slug: "custom-gaming-pc",
      description: "คอมพิวเตอร์ประกอบสำหรับเล่นเกมระดับไฮเอนด์ ระบบน้ำเปิด/ปิด และไฟ RGB ปรับแต่งเฉพาะคุณ",
      sortOrder: 1,
    },
    {
      name: "Workstation & Creator PC",
      slug: "workstation-pc",
      description: "คอมพิวเตอร์สำหรับงานตัดต่อวิดีโอ 8K, 3D Rendering, สถาปัตยกรรม และงานประมวลผลขั้นสูง",
      sortOrder: 2,
    },
    {
      name: "Gaming Gear & Peripherals",
      slug: "gaming-gear",
      description: "เกมมิ่งเกียร์ระดับโปรเพลเยอร์ จอภาพมอนิเตอร์ 240Hz+ คีย์บอร์ด Custom และเมาส์ไร้สาย",
      sortOrder: 3,
    },
    {
      name: "PC Hardware & Upgrades",
      slug: "pc-hardware",
      description: "การ์ดจอ GPU, CPU เจนล่าสุด, RAM DDR5 และ SSD NVMe Gen 5 ความเร็วสูงแท้ประกันศูนย์ไทย",
      sortOrder: 4,
    },
  ];

  const categoryMap = new Map<string, number>();

  for (const cat of categoryData) {
    const [inserted] = await db.insert(categories).values(cat).returning();
    categoryMap.set(cat.slug, inserted.id);
  }
  console.log("✅ 4 Computer Categories seeded");

  // 4. Create Computer Products & Custom Builds
  const productsData = [
    {
      catSlug: "custom-gaming-pc",
      name: "NEXUS CyberBeast RTX 4090 Custom Watercooled PC",
      description: "สเปกท็อปสุดแห่งยุค: Intel Core i9-14900KS + NVIDIA GeForce RTX 4090 24GB + RAM 64GB DDR5 6400MHz + ชุดน้ำเปิด Hard Tube Custom ลูปคู่ เคสกระจกพาโนรามา เล่นได้ทุกเกมระดับ 4K 144Hz ปรับสุด",
      price: "139000.00",
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      catSlug: "workstation-pc",
      name: "PRO-STUDIO Workstation Threadripper & RTX 4080 Super",
      description: "ขุมพลังสำหรับสตูดิโอตัดต่อ 8K และงาน 3D VFX: AMD Ryzen Threadripper 7960X (24 Cores / 48 Threads) + 128GB DDR5 ECC RAM + RTX 4080 Super 16GB + 4TB Gen5 NVMe เสถียรภาพระดับ 24/7",
      price: "115000.00",
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      catSlug: "gaming-gear",
      name: "NEXUS Apex Pro Wireless Custom Keyboard (Hot-Swap)",
      description: "คีย์บอร์ดกลไกไร้สายบอดี้อะลูมิเนียม CNC ชุบอโนไดซ์ สวิตช์ Linear สั่งลูบพิเศษจากโรงงาน คีย์แคป PBT Double-shot ไฟ RGB Per-key รองรับ Tri-mode (Bluetooth / 2.4GHz / Type-C)",
      price: "4890.00",
      imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      catSlug: "custom-gaming-pc",
      name: "NEXUS Vortex Air i7 + RTX 4070 Ti Super",
      description: "เครื่องเกมมิ่งยอดนิยม คุ้มค่าที่สุด: Intel Core i7-14700KF + RTX 4070 Ti Super 16GB + 32GB DDR5 + ชุดน้ำปิด AIO 360mm พร้อมพัดลม ARGB ไหลเวียนอากาศเยี่ยม รองรับ 2K / 4K สบาย",
      price: "64900.00",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 4,
    },
    {
      catSlug: "gaming-gear",
      name: "ULTRA-VIEW 34\" Curved QD-OLED 175Hz Gaming Monitor",
      description: "จอเกมมิ่งโค้งระดับพรีเมียม 34 นิ้ว สัดส่วน 21:9 WQHD พาเนล QD-OLED แท้ คอนทราสต์ลึกไร้ที่ติ Response Time 0.03ms อัตรารีเฟรช 175Hz รองรับ G-Sync และ DisplayHDR True Black 400",
      price: "29900.00",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      catSlug: "custom-gaming-pc",
      name: "NEXUS Ghost White Mini-ITX Ryzen 7 + RTX 4070 Super",
      description: "คอมประกอบสายมินิมอลไซส์กะทัดรัด ดีไซน์สีขาวบริสุทธิ์: AMD Ryzen 7 7800X3D (CPU เล่นเกมที่ดีที่สุด) + RTX 4070 Super White Edition + 32GB DDR5 วางบนโต๊ะคอมได้สวยงามไม่เปลืองพื้นที่",
      price: "52900.00",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 6,
    },
    {
      catSlug: "gaming-gear",
      name: "AERO-LIGHT Wireless Gaming Mouse 49g (PAW3395)",
      description: "เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษเพียง 49 กรัม เซนเซอร์ไฮเอนด์ PixArt PAW3395 26,000 DPI สวิตช์ Optical ทนทาน 80 ล้านคลิก รองรับ 4K Polling Rate แม่นยำทุกเสี้ยววินาที",
      price: "2990.00",
      imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 7,
    },
    {
      catSlug: "pc-hardware",
      name: "GEN5 HyperSpeed NVMe M.2 SSD 2TB (12,400 MB/s)",
      description: "SSD PCIe 5.0 x4 สปีดทะลุขีดจำกัด อ่านเร็วสูงสุด 12,400 MB/s เขียนเร็ว 11,800 MB/s พร้อมฮีตซิงก์อะลูมิเนียมเกรดอากาศยาน ถ่ายโอนไฟล์ขนาดใหญ่และโหลดเกมเร็วในพริบตา",
      price: "7890.00",
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 8,
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.catSlug)!;
    await db.insert(services).values({
      categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
  }
  console.log("✅ 8 Computer Products & Builds seeded (3 featured)");

  // 5. Seed Website Settings (Computer Store)
  await db.insert(settings).values({
    storeName: "NEXUS Custom PC & Gaming Gear",
    tagline: "High-Performance Custom PC, Workstations & Gaming Peripherals",
    logoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
    phone: "02-888-9999",
    email: "contact@nexuspc.co.th",
    address: "101/5 อาคารไอทีคอมเพล็กซ์ ชั้น 3 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310",
    businessHours: "จันทร์ - เสาร์: 10:00 - 20:00 น. (หยุดทุกวันอาทิตย์)",
    lineId: "@nexuspc",
    lineUrl: "https://line.me/R/ti/p/@nexuspc",
    facebookUrl: "https://facebook.com/nexuspc.th",
    instagramUrl: "https://instagram.com/nexuspc.th",
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.540871181816!2d100.5639693!3d13.7578135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e84b8d7eb8f%3A0x6b7724a44b82967!2sFortune%20Town!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth",
  });
  console.log("✅ Computer Store Settings seeded");

  // 6. Seed Page Contents & SEO
  const pagesData = [
    {
      pageKey: "home",
      heroTitle: "ปลดล็อกขีดจำกัดแห่งพลังคอมพิวเตอร์ และเกมมิ่งเกียร์ระดับไฮเอนด์",
      heroSubtitle: "NEXUS ผู้นำด้านการจัดสเปกคอมพิวเตอร์ประกอบระดับพรีเมียม เวิร์กสเตชันสำหรับครีเอเตอร์ และระบบระบายความร้อนด้วยน้ำ Custom สั่งประกอบตามงบประมาณ พร้อมการรับประกันศูนย์ไทยแท้ 100%",
      heroImageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&auto=format&fit=crop&q=80",
      heroCtaText: "ปรึกษาจัดสเปกคอม / ส่งข้อความติดต่อ",
      highlights: [
        {
          icon: "Cpu",
          title: "Tailored Custom Specs",
          description: "จัดสเปกตรงความต้องการและงบประมาณ ไม่ยัดไส้อุปกรณ์ เลือกชิ้นส่วนเกรดท็อปเพื่อความคุ้มค่าสูงสุด",
        },
        {
          icon: "ShieldCheck",
          title: "100% Genuine Warranty",
          description: "อุปกรณ์ทุกชิ้นเป็นของแท้ศูนย์ไทย พร้อมบริการส่งเคลมแบบ One-Stop และเครื่องสำรองระหว่างซ่อม",
        },
        {
          icon: "Zap",
          title: "24-Hour Stress Testing",
          description: "ผ่านการทดสอบ Benchmark และ Full Load นาน 24 ชั่วโมง เพื่อให้มั่นใจในเสถียรภาพสูงสุดก่อนส่งมอบ",
        },
        {
          icon: "Wrench",
          title: "Artisanal Cable Management",
          description: "บริการจัดสายไฟแบบมืออาชีพ เนียนตาเป็นระเบียบ พร้อมระบบท่อทางเดินน้ำระบายความร้อนระดับมาสเตอร์",
        },
      ],
      metaTitle: "NEXUS Custom PC & Gaming Gear | คอมพิวเตอร์ประกอบ จัดสเปกคอมพิวเตอร์ พระราม 9",
      metaDescription: "ร้านประกอบคอมพิวเตอร์ระดับพรีเมียม เวิร์กสเตชัน และเกมมิ่งเกียร์ จัดสเปกตามสั่ง เทสระบบเสถียร 100% พร้อมประกันศูนย์ไทย",
      ogImageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80",
    },
    {
      pageKey: "about",
      aboutStory: "NEXUS ก่อตั้งขึ้นโดยกลุ่มวิศวกรฮาร์ดแวร์และเกมเมอร์ผู้หลงใหลในประสิทธิภาพสูงสุดของคอมพิวเตอร์ เราเชื่อว่าคอมพิวเตอร์ประกอบไม่ได้เป็นเพียงกล่องสี่เหลี่ยมที่มีแผงวงจร แต่คือเครื่องมือขับเคลื่อนความฝัน ความคิดสร้างสรรค์ และชัยชนะในการแข่งขัน\n\nเราคัดสรรเฉพาะอุปกรณ์คุณภาพสูงจากแบรนด์ชั้นนำระดับโลก ไม่ว่าจะเป็น Intel, AMD, NVIDIA, ASUS, Corsair และ Lian Li ทุกเครื่องผ่านการประกอบด้วยความประณีต เก็บสายไฟอย่างสวยงาม และผ่านกระบวนการ Stress Test อย่างเข้มงวด เพื่อให้คุณมั่นใจได้ว่าคอมพิวเตอร์ทุกเครื่องจาก NEXUS จะทำงานได้อย่างเต็มประสิทธิภาพและมีอายุการใช้งานยาวนานที่สุด",
      aboutImageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80",
      metaTitle: "เกี่ยวกับเรา | NEXUS Custom PC & Tech Studio",
      metaDescription: "เรื่องราวของ NEXUS ผู้เชี่ยวชาญด้านการจัดสเปกคอมพิวเตอร์ประกอบ เวิร์กสเตชัน และเกมมิ่งเกียร์ระดับพรีเมียม",
      ogImageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80",
    },
    {
      pageKey: "contact",
      metaTitle: "ติดต่อเรา & ปรึกษาจัดสเปกคอม | NEXUS Custom PC พระราม 9",
      metaDescription: "ติดต่อสอบถาม ขอใบเสนอราคาจัดสเปกคอมพิวเตอร์ ที่ตั้งร้าน แผนที่ และบริการดูแลหลังการขาย NEXUS PC",
      ogImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    },
  ];

  for (const p of pagesData) {
    await db.insert(pageContents).values(p);
  }
  console.log("✅ Page Contents & SEO seeded");

  // 7. Seed Sample message
  await db.insert(messages).values({
    name: "คุณธนภัทร วิจิตรศิลป์",
    phone: "081-445-5667",
    email: "tanapat.vfx@gmail.com",
    subject: "สอบถามจัดสเปกคอมพิวเตอร์สำหรับงานเรนเดอร์ Blender & Unreal Engine 5",
    message: "สวัสดีครับ สนใจสั่งประกอบ Workstation งบประมาณ 80,000 - 90,000 บาท ต้องการการ์ดจอ RTX 4080 Super และ RAM 64GB DDR5 อยากทราบระยะเวลาประกอบและเงื่อนไขการออกใบกำกับภาษีครับ",
    isRead: false,
  });
  console.log("✅ Sample computer inquiry message seeded");

  console.log("✨ Computer Store Seeding completed successfully!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
