import express from "express";
import { addCompany, loginCompany } from "../controllers/company.js";
import companyAuth from "../middleware/companyAuth.js";

const router = express.Router();

router.post("/addCompany", addCompany);
router.post("/loginCompany", companyAuth, loginCompany);

export default router;
