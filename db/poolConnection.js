import { createPool } from "mysql2";
import { appConfig } from "../config/config.js";

const pragatiDb = createPool(appConfig.db.pragati);
const transactionsDb = createPool(appConfig.db.transactions);

export { pragatiDb, transactionsDb };
