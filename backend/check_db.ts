import { query } from "./src/config/database.js";

async function run() {
  try {
    const [rows] = await query("SELECT id, name, code, provider FROM payment_methods");
    console.log("PAYMENT METHODS:", rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
