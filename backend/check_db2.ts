import { query } from "./src/config/database.js";

async function run() {
  try {
    const rows = await query("SELECT id, name, price, stock_quantity FROM products WHERE stock_quantity > 0 LIMIT 1");
    console.log("VALID PRODUCT:", JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
