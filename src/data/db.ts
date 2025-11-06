import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

let client: Pool;

if (ENV == "dev") {
  client = new Pool({
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT || "5432"),
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else if (ENV == "test") {
  client = new Pool({
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT || "5432"),
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else {
  throw new Error("ENV must be set to 'dev' or 'test'");
}

export default client;
