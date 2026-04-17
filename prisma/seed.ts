import { PrismaClient } from '@prisma/client'
import { templates } from '../src/lib/templates/index';

const prisma = new PrismaClient()

async function main() {
  await prisma.property.deleteMany({});
  await prisma.template.deleteMany({});
  
  const pool = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1f0b001a18?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521483861217-1db25816bb1d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80"
  ];

  const generateImages = (offset: number) => {
     const arr = [];
     for(let i=0; i<12; i++) {
        arr.push(pool[(offset + i) % pool.length]);
     }
     return JSON.stringify(arr);
  };

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
      buildingInfo: "Built in 2020 by renowned architects, featuring concrete and steel reinforced construction.",
      entranceHall: "Grand double-height foyer with imported Italian marble flooring and a sweeping cantilevered staircase.",
      kitchenLounge: "Open concept chef's kitchen with dual islands, Miele appliances, flowing into a sunken lounge.",
      bedroomOne: "Massive primary suite with private balcony offering 180-degree ocean views.",
      enSuite: "Spa-like marble bathroom with a freestanding soaking tub and dual rainfall showers.",
      bedroomTwo: "Generous guest suite located on the ground floor with private patio access.",
      bathroomDetails: "All guest bathrooms feature radiant heated floors and frameless glass enclosures.",
      externally: "Meticulously landscaped terraced gardens leading down to a zero-edge infinity pool.",
      additionalInfo: "Smart home entirely operated controlled via Savant. Three-car climate-controlled garage.",
      agentsNotes: "This property represents the pinnacle of modern luxury. A truly rare listing.",
      disclaimer: "All measurements are approximate. Buyer to verify.",
      viewingArrangements: "Strictly by private appointment only. Proof of funds required.",
      images: generateImages(0),
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
       buildingInfo: "Located atop the exclusive Skyline Tower, a LEED Gold certified high-rise.",
       entranceHall: "Direct private elevator access opening into a gallery-style hallway.",
       kitchenLounge: "Minimalist Poliform kitchen with concealed appliances blending seamlessly into the vast living space.",
       bedroomOne: "Corner master bedroom wrapped in glass, capturing stunning sunrise city views.",
       enSuite: "Oversized wet room with dark slate tile and custom automated privacy glass.",
       bedroomTwo: "Comfortable guest bedroom overlooking the eastern skyline.",
       bathroomDetails: "Designer fixtures throughout with programmable chromatherapy lighting.",
       externally: "A 1,200 sq ft private rooftop terrace with outdoor kitchen and fire pit.",
       additionalInfo: "Includes two prime deeded parking spaces and a private wine locker in the lobby.",
       agentsNotes: "The ultimate trophy property for the urban aficionado.",
       disclaimer: "HOA fees are subject to annual review.",
       viewingArrangements: "Showings available weekdays between 10am and 4pm.",
       images: generateImages(3),
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
       buildingInfo: "Original 1925 timber frame construction with completely updated electrical and plumbing.",
       entranceHall: "Welcoming entryway retaining original oak hardwoods and crown molding.",
       kitchenLounge: "Farmhouse style kitchen with apron sink, butcher block counters, and a cozy breakfast nook.",
       bedroomOne: "Abundant natural light with original built-in window seating and extensive closet space.",
       enSuite: "Tastefully modernized keeping vintage clawfoot tub alongside a modern shower stall.",
       bedroomTwo: "Charming dormer bedroom perfect for a nursery or home office.",
       bathroomDetails: "Classic penny-tile flooring combined with modern low-flow fixtures.",
       externally: "Fully fenced backyard featuring mature fruit trees and a detached 200 sq ft studio.",
       additionalInfo: "New architectural shingle roof installed in 2022.",
       agentsNotes: "A remarkably well-preserved home that combines historical charm with modern reliability.",
       disclaimer: "Square footage includes the detached studio.",
       viewingArrangements: "Open house this Sunday from 1pm to 4pm.",
       images: generateImages(6),
       agentName: "Emily Roberts",
       agentEmail: "emily@suburbhomes.com",
       agentPhone: "+1 (555) 321-4321"
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
       buildingInfo: "Poured earth walls providing exceptional thermal mass and energy efficiency.",
       entranceHall: "Custom pivot iron door opening to a sun-drenched atrium.",
       kitchenLounge: "Expansive great room with vaulted ceilings and a massive geometric granite island.",
       bedroomOne: "Serene primary suite with direct access to the shaded rear loggia.",
       enSuite: "Indoor/outdoor shower experience seamlessly connected to a private walled courtyard.",
       bedroomTwo: "Spacious secondary suite with built-in artisan adobe shelving.",
       bathroomDetails: "Hand-painted Talavera tiles combined with raw concrete trough sinks.",
       externally: "Native zero-scape landscaping, built-in BBQ, and a raised heated plunge pool.",
       additionalInfo: "Generates surplus electricity via a newly installed 12kW solar array.",
       agentsNotes: "The perfect blend of eco-conscious architecture and luxurious comfort.",
       disclaimer: "Property boundaries extend 50 feet past the rear wall.",
       viewingArrangements: "Available for showing upon request.",
       images: generateImages(8),
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
       description: "A cozy log cabin nestled deep in the forest, featuring a massive stone fireplace and a wraparound deck for wildlife viewing.",
       buildingInfo: "Authentic hand-hewn log construction. Built in 1985 on a solid stone foundation.",
       entranceHall: "Practical mudroom to store snow gear before entering the main living space.",
       kitchenLounge: "Heart of the home featuring an open concept, hickory cabinets, and a soaring two-story stone chimney.",
       bedroomOne: "Main floor bedroom with rustic wood paneling and large double-hung windows.",
       enSuite: "N/A - the home features a single centrally located full bathroom.",
       bedroomTwo: "Loft-style bedroom overlooking the lounge area.",
       bathroomDetails: "Features a rustic copper sink and an oversized enclosed shower.",
       externally: "Surrounded by 5 acres of dense pine forest with a seasonal creek at the property line.",
       additionalInfo: "Operates entirely off-grid with a robust solar setup and deep water well.",
       agentsNotes: "Ideal for hunters, writers, or anyone looking to truly escape the city noise.",
       disclaimer: "Winter access may require a 4x4 or snowmobile.",
       viewingArrangements: "Accompanied showings only due to remote location.",
       images: generateImages(11),
       agentName: "Emily Roberts",
       agentEmail: "emily@suburbhomes.com",
       agentPhone: "+1 (555) 321-4321"
    }
  ]

  for (const property of properties) {
    await prisma.property.create({
      data: property
    })
  }
  
  console.log(`Seeded ${properties.length} properties.`);

  // Seed sample templates mapped to database
  for (const template of templates) {
    await prisma.template.create({
      data: {
        id: template.id,
        name: template.name,
        description: template.mood || "Preset Template",
        configJson: JSON.stringify(template)
      }
    });
  }

  console.log(`Seeded ${templates.length} templates.`);
  console.log("Database seeded successfully with all sample data!");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
