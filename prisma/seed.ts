import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { 
  BookingType, 
  PricingModel, 
  AccommodationCategory, 
  AccommodationStatus, 
  InclusionCategory, 
  AmenityCategory
} from './generated/prisma/client.js';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data (Order matters due to Foreign Key constraints)
  await prisma.packageInclusion.deleteMany({});
  await prisma.packageAccommodation.deleteMany({});
  await prisma.accommodation.deleteMany({});
  await prisma.accommodationType.deleteMany({});
  await prisma.package.deleteMany({});

  console.log('Cleaned existing database records.');

  // 2. Create Accommodation Types
  const Seaside = await prisma.accommodationType.create({
    data: {
      name: 'Seaside',
      category: AccommodationCategory.ROOM,
      description: 'An intimate seaside hideaway offering comfort, privacy, and a beautiful view of the beach — perfect for couples seeking a peaceful retreat.',
      capacity: 2,
      isActive: true,
    },
  });

  const Veranda = await prisma.accommodationType.create({
    data: {
      name: 'Veranda',
      category: AccommodationCategory.ROOM,
      description: 'A spacious dormitory-style room ideal for groups or families looking to relax together by the beach.',
      capacity: 6,
      isActive: true,
    },
  });

  console.log('Created accommodation types.');

  // 3. Create Specific Physical Accommodations (Units)
  await prisma.accommodation.createMany({
    data: [
      { accommodationTypeId: Seaside.id, unitNumber: '101', status: AccommodationStatus.AVAILABLE },
      { accommodationTypeId: Veranda.id, unitNumber: '201', status: AccommodationStatus.AVAILABLE },
    ],
  });

  console.log('Created physical accommodation units.');

  // 4. Create Packages
  const seasidePackage = await prisma.package.create({
    data: {
      name: 'Seaside',
      slug: 'seaside',
      description: 'An intimate seaside hideaway offering comfort, privacy, and a beautiful view of the beach — perfect for couples seeking a peaceful retreat.',
      bookingType: BookingType.OVERNIGHT,
      pricingModel: PricingModel.PER_ROOM,
      basePrice: 2950.00,
      durationNights: 1,
      maxGuests: 2,
      isActive: true,
    },
  });

  const verandaPackage = await prisma.package.create({
    data: {
      name: 'Veranda',
      slug: 'veranda',
      description: 'A spacious dormitory-style room ideal for groups or families looking to relax together by the beach.',
      bookingType: BookingType.OVERNIGHT,
      pricingModel: PricingModel.PER_ROOM,
      basePrice: 4500.00,
      durationNights: 1,
      maxGuests: 6,
      isActive: true,
    },
  });

  const dayTour = await prisma.package.create({
    data: {
      name: 'Day Tour & Beach Pass',
      slug: 'day-tour-beach-pass',
      description: 'Full-day access to resort grounds and beach',
      bookingType: BookingType.DAY_TOUR,
      pricingModel: PricingModel.PER_PERSON,
      basePrice: 275.00,
      durationNights: null, // Null for day tours as per your comments
      maxGuests: 20,
      isActive: true,
    },
  });

  console.log('Created packages.');

  // 5. Connect Packages to Accommodations (Junction Table)
  await prisma.packageAccommodation.createMany({
    data: [
      {
        packageId: seasidePackage.id,
        accommodationTypeId: Seaside.id,
        quantity: 1,
        priceOverride: null,
        sortOrder: 1,
      },
      {
        packageId: verandaPackage.id,
        accommodationTypeId: Veranda.id,
        quantity: 1,
        priceOverride: null, // custom price override example
        sortOrder: 1,
      },
    ],
  });

  console.log('Linked packages to accommodation types.');

  // 6. Create Package Inclusions
  await prisma.packageInclusion.createMany({
    data: [
      // Couples Getaway Inclusions
      {
        packageId: seasidePackage.id,
        name: 'Welcome Bottle of Champagne',
        category: InclusionCategory.AMENITY,
        quantityPerBooking: 1,
        description: 'Chilled champagne waiting in your room upon arrival.',
        sortOrder: 1,
      },
      {
        packageId: verandaPackage.id,
        name: 'Complimentary Spa Coupons',
        category: InclusionCategory.OTHER,
        quantityPerBooking: 2,
        description: 'Valid for a 60-minute Swedish massage.',
        sortOrder: 2,
      },
      {
        packageId: dayTour.id,
        name: 'Beach Towel & Lounger Access',
        category: InclusionCategory.EQUIPMENT,
        quantityPerBooking: 1,
        description: 'Includes a beach towel and lounger access.',
        sortOrder: 2,
      },
    ],
  });

  // 1. Create Base Amenities First
const queenBed = await prisma.amenity.create({
  data: {
    name: 'Queen Bed',
    category: AmenityCategory.BEDDING,
    iconName: 'bed-queen',
  }
});

const airCon = await prisma.amenity.create({
  data: {
    name: 'Air Conditioning',
    category: AmenityCategory.APPLIANCE,
    iconName: 'snowflake',
  }
});

const kitchen = await prisma.amenity.create({
  data: {
    name: 'Full Kitchen',
    category: AmenityCategory.KITCHEN,
    iconName: 'stove',
  }
});

// 3. Link the Amenities to the Room Type
await prisma.accommodationTypeAmenity.createMany({
  data: [
    {
      accommodationTypeId: Seaside.id,
      amenityId: queenBed.id,
      quantity: 1, 
    },
    {
      accommodationTypeId: Seaside.id,
      amenityId: airCon.id,
      quantity: 1,
    },
    {
      accommodationTypeId: Seaside.id,
      amenityId: kitchen.id,
      quantity: 1,
      notes: 'Includes microwave and fridge', // Utilizing the notes field
    }
  ]
});

  console.log('Database seeding complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });