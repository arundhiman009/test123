import { Router } from "express";
import router from "./contactRoute";

const route = Router();

route.use('/api',router)

export default route;