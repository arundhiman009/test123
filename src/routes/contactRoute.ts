import express from "express";
const router = express.Router();
import ContactController from "../controller/contactController";

const controller = new ContactController()

router.get('/contacts',  controller.getAllContact);
router.post('/import',controller.importContact);
router.post('/contacts/:id',   controller.editContact);
router.delete('/contacts/:id',   controller.deleteContact);

export default router;