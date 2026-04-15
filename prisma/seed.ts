import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const properties = [
    {
      title: "Luxury Hillside Villa",
      type: "Villa",
      price: 2500000,
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      address: "123 Beverly Hills Drive, CA",
      description: "A stunning hillside villa boasting panoramic views, an infinity pool, and a state-of-the-art cinematic theatre.",
      images: JSON.stringify(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"]),
      agentName: "Sarah Jenkins",
      agentEmail: "sarah@elitehomes.com",
      agentPhone: "+1 (555) 123-4567"
    },
    {
       title: "Modern Downtown Penthouse",
       type: "Apartment",
       price: 1800000,
       bedrooms: 3,
       bathrooms: 3,
       area: 2800,
       address: "450 Skyline Blvd, NY",
       description: "Sleek and minimalist penthouse located in the heart of downtown, featuring floor-to-ceiling windows and a private rooftop terrace.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1f0b001a18?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Michael Chang",
       agentEmail: "michael@cityliving.com",
       agentPhone: "+1 (555) 987-6543"
    },
    {
       title: "Charming Suburban Cottage",
       type: "House",
       price: 450000,
       bedrooms: 4,
       bathrooms: 2,
       area: 1900,
       address: "88 Maple Street, CT",
       description: "A beautifully restored 1920s cottage with a wrap-around porch, mature gardens, and a detached artist studio.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Emily Roberts",
       agentEmail: "emily@suburbhomes.com",
       agentPhone: "+1 (555) 321-4321"
    },
    {
       title: "Seaside Retreat",
       type: "House",
       price: 3200000,
       bedrooms: 6,
       bathrooms: 5,
       area: 5200,
       address: "12 Oceanfront Lane, FL",
       description: "Spectacular oceanfront property with private beach access, a boat dock, and expansive outdoor entertaining areas.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1521483861217-1db25816bb1d?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Sarah Jenkins",
       agentEmail: "sarah@elitehomes.com",
       agentPhone: "+1 (555) 123-4567"
    },
    {
       title: "Urban Loft Studio",
       type: "Apartment",
       price: 650000,
       bedrooms: 1,
       bathrooms: 1,
       area: 950,
       address: "Unit 3B, The Foundry, NY",
       description: "Industrial chic loft featuring exposed brick walls, polished concrete floors, and 14-foot open ceilings.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Michael Chang",
       agentEmail: "michael@cityliving.com",
       agentPhone: "+1 (555) 987-6543"
    },
    {
       title: "Classic Victorian Manor",
       type: "House",
       price: 1450000,
       bedrooms: 5,
       bathrooms: 4,
       area: 4000,
       address: "400 Heritage Row, VA",
       description: "An impeccably maintained historical manor showcasing original woodwork, stained glass, and a grand staircase.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"]),
       agentName: "William Tudor",
       agentEmail: "william@historicestates.com",
       agentPhone: "+1 (555) 444-5555"
    },
    {
       title: "Desert Oasis Estate",
       type: "Villa",
       price: 890000,
       bedrooms: 4,
       bathrooms: 3,
       area: 3100,
       address: "22 Cactus Trail, AZ",
       description: "Contemporary desert living at its finest, featuring passive solar design and a stunning drought-resistant botanical garden.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Marcus Vega",
       agentEmail: "marcus@desertdwellings.com",
       agentPhone: "+1 (555) 666-7777"
    },
    {
       title: "Mountain View Cabin",
       type: "Cabin",
       price: 320000,
       bedrooms: 2,
       bathrooms: 1,
       area: 1200,
       address: "Mile 14, Pinecone Ridge, CO",
       description: "A cozy, off-grid log cabin nestled deep in the forest, perfect as a tranquil weekend retreat or hunting lodge.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Emily Roberts",
       agentEmail: "emily@suburbhomes.com",
       agentPhone: "+1 (555) 321-4321"
    },
    {
       title: "Contemporary Family Home",
       type: "House",
       price: 780000,
       bedrooms: 4,
       bathrooms: 3,
       area: 2400,
       address: "55 Meadowbrook Dr, TX",
       description: "A perfect family home within a top-rated school district, boasting an open floor plan and a huge fenced backyard.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Sarah Jenkins",
       agentEmail: "sarah@elitehomes.com",
       agentPhone: "+1 (555) 123-4567"
    },
    {
       title: "Ultra-Modern Tech Mansion",
       type: "Villa",
       price: 5500000,
       bedrooms: 7,
       bathrooms: 8,
       area: 8900,
       address: "1 Silicon Way, CA",
       description: "The ultimate smart home equipped with full voice automation, a private bowling alley, and an underground 10-car garage.",
       images: JSON.stringify(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"]),
       agentName: "Marcus Vega",
       agentEmail: "marcus@desertdwellings.com",
       agentPhone: "+1 (555) 666-7777"
    }
  ]

  for (const property of properties) {
    await prisma.property.create({
      data: property
    })
  }

  console.log("Database seeded successfully with 10 dummy properties!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
