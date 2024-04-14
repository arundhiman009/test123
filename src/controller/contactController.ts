import { Request, Response } from 'express';
import Joi from 'joi';
import SendResponse from '../utils/response';
import StatusCodeEnum from '../utils/status';
import contactInterface from 'src/interface/contactInterface';
import MessageEnum from '../utils/msg';
import xml2js from 'xml2js';
import fs from 'fs';
import contactStore from '../store/contactStore';

const Contact = new contactStore()

export default class ContactController {
    
    /**
     * Import contacts from XML file
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {void}
    */

    public async importContact(req: Request, res : Response): Promise<void>  {     
        const filePath = './contacts.xml';
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            xml2js.parseString(data, async (parseErr, result) => {
                if (parseErr) {
                    return SendResponse(res, [], "Error parsing XML",StatusCodeEnum.INTERNAL_SERVER_ERROR);   
                }                
                const { contacts: { contact } } = result;
                const allContacts = contact.map(item => ({
                    name: item.name[0],
                    lastName: item.lastName[0],
                    phone: item.phone[0]
                }));
               const section: contactInterface[] = await Contact.importContacts(allContacts)
               return SendResponse(res, section, MessageEnum.CONTACT_IMPORT,StatusCodeEnum.OK);                          
            })
        } catch (err) {
            return SendResponse(res, [], err.message, StatusCodeEnum.INTERNAL_SERVER_ERROR);       
        }
    }
    /**
     * Edit a contact
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {void}
    */

    public async editContact(req: Request , res : Response): Promise<void>  {
        try {
            const schema = Joi.object().keys({
                name: Joi.string().required(),
                lastName: Joi.string().required(),
                phone: Joi.string().required(),
            });
            const params = schema.validate(req.body, { abortEarly: false });
            if (params.error) {   
                return SendResponse(res, params.error, MessageEnum.VALIDATION_FAILED, StatusCodeEnum.BAD_REQUEST);
            }
            const _id = req.params.id as string;
            const result = await Contact.updateContact(_id,params.value);
            return SendResponse(res, result, MessageEnum.CONTACT_UPDATED,StatusCodeEnum.OK);
        } catch (error) {
            return SendResponse(res, [],error.message,StatusCodeEnum.INTERNAL_SERVER_ERROR); 
        }       
    }

    /**
     * Get all contacts
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {void}
    */

    public async getAllContact(req: Request, res : Response): Promise<void>  {
        try {
            const data:  contactInterface[] = await Contact.findAllContacts();
            return SendResponse(res, data, MessageEnum.GET_CONTACT,StatusCodeEnum.OK); 
        } catch (error) {
            return SendResponse(res, [],error.getmessage,StatusCodeEnum.INTERNAL_SERVER_ERROR); 
        }
    }

    /**
     * Delete a contact
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {void}
    */

    public async deleteContact(req: Request, res : Response): Promise<void>  {
        try {
            
           const _id = req.params.id as string;
            await Contact.deleteContact(_id)
            return SendResponse(res, [], MessageEnum.CONTACT_DELETED,StatusCodeEnum.OK);
        } catch (error) {
            return SendResponse(res, [], error.message, StatusCodeEnum.INTERNAL_SERVER_ERROR); 
        }
    }
} 