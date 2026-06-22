import { app } from "./app.js";
import { env } from "./config/env.js";
import { getPool } from "./config/database.js";
import { ensureDefaultUploadFolders } from "./utils/uploads.js";

ensureDefaultUploadFolders();

getPool();

app.listen(env.PORT, () => {
  console.log(`Admin backend listening on http://localhost:${env.PORT}`);
});
