import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";

/*
    This file sets up the Prisma Client for database interactions.
    It uses the PrismaPg adapter to connect to a PostgreSQL database using the connection string defined in the environment variable DATABASE_URL.
    The PrismaClient instance is exported for use throughout the application, allowing for type-safe database queries and operations.
*/

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;