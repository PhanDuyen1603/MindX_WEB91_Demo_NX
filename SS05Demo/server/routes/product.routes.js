import { Router} from "express";
const r = Router();

r.get("/", (_req, res)=> res.send("Product route ready!"))


export default r;