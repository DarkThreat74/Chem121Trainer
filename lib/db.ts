import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL!;

export const sql = neon(connectionString);

export const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

