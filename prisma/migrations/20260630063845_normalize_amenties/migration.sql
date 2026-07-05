/*
  Warnings:

  - You are about to drop the column `amenities` on the `accommodation_types` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "amenity_category" AS ENUM ('BEDDING', 'APPLIANCE', 'BATHROOM', 'KITCHEN', 'OUTDOOR', 'VIEW', 'CONNECTIVITY', 'OTHER');

-- AlterTable
ALTER TABLE "accommodation_types" DROP COLUMN "amenities";

-- CreateTable
CREATE TABLE "amenities" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "amenity_category" NOT NULL,
    "description" VARCHAR(255),
    "iconName" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_type_amenities" (
    "accommodationTypeId" BIGINT NOT NULL,
    "amenityId" BIGINT NOT NULL,
    "quantity" SMALLINT DEFAULT 1,
    "notes" VARCHAR(100),

    CONSTRAINT "accommodation_type_amenities_pkey" PRIMARY KEY ("accommodationTypeId","amenityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- AddForeignKey
ALTER TABLE "accommodation_type_amenities" ADD CONSTRAINT "accommodation_type_amenities_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "accommodation_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_type_amenities" ADD CONSTRAINT "accommodation_type_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
