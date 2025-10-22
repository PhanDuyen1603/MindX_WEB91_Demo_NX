import { writeFileSync } from "fs";
import { customers, products, orders } from "./data.js";

const db = { customers, products, orders };
writeFileSync("./db.json", JSON.stringify(db, null, 2), "utf8");
console.log("Generated db.json from data.js");
