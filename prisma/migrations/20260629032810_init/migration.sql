-- CreateEnum
CREATE TYPE "booking_type" AS ENUM ('OVERNIGHT', 'DAY_TOUR');

-- CreateEnum
CREATE TYPE "pricing_model" AS ENUM ('PER_ROOM', 'PER_PERSON', 'FLAT_RATE');

-- CreateEnum
CREATE TYPE "accommodation_category" AS ENUM ('ROOM', 'VILLA', 'COTTAGE', 'SUITE', 'CABIN');

-- CreateEnum
CREATE TYPE "accommodation_status" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "inclusion_category" AS ENUM ('ENTRANCE', 'FURNITURE', 'EQUIPMENT', 'AMENITY', 'OTHER');

-- CreateTable
CREATE TABLE "packages" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "description" TEXT,
    "bookingType" "booking_type" NOT NULL,
    "pricingModel" "pricing_model" NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "durationNights" SMALLINT,
    "maxGuests" SMALLINT NOT NULL DEFAULT 2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_types" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "accommodation_category" NOT NULL,
    "description" TEXT,
    "capacity" SMALLINT NOT NULL,
    "amenities" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "accommodation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" BIGSERIAL NOT NULL,
    "accommodationTypeId" BIGINT NOT NULL,
    "unitNumber" VARCHAR(20) NOT NULL,
    "status" "accommodation_status" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_accommodations" (
    "packageId" BIGINT NOT NULL,
    "accommodationTypeId" BIGINT NOT NULL,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "priceOverride" DECIMAL(10,2),
    "sortOrder" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "package_accommodations_pkey" PRIMARY KEY ("packageId","accommodationTypeId")
);

-- CreateTable
CREATE TABLE "package_inclusions" (
    "id" BIGSERIAL NOT NULL,
    "packageId" BIGINT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "category" "inclusion_category" NOT NULL,
    "quantityPerBooking" SMALLINT NOT NULL DEFAULT 1,
    "description" TEXT,
    "sortOrder" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "package_inclusions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "packages_name_key" ON "packages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_types_name_key" ON "accommodation_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_unitNumber_key" ON "accommodations"("unitNumber");

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "accommodation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_accommodations" ADD CONSTRAINT "package_accommodations_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_accommodations" ADD CONSTRAINT "package_accommodations_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "accommodation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_inclusions" ADD CONSTRAINT "package_inclusions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
