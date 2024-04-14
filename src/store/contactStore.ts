import MessageEnum from "../utils/msg";
import { contactModel } from "../model/contact";
import contactInterface from "../interface/contactInterface";

export default class ContactStore {

    /**
     * Find all contacts
     * @returns {Promise<contactInterface[]>} A Promise resolving to an array of contacts
     */

    async findAllContacts(): Promise<contactInterface[]> {
        return await contactModel.find();
    }

    /**
     * Import contacts, checking for duplicates by phone number
     * @param {contactInterface[]} data - Array of contacts to import
     * @returns {Promise<contactInterface[]>} A Promise resolving to the newly imported contacts
     */

    public async importContacts(data: contactInterface[]): Promise<contactInterface[]> {
        try {
            const existingContacts = await contactModel.find();
            const existingPhoneNumbers = existingContacts.map(contact => contact.phone);
            const newContacts = data.filter(contact => !existingPhoneNumbers.includes(contact.phone));
            if (newContacts.length === 0) {
                return existingContacts;
            }
            const insertedContacts = await contactModel.insertMany(newContacts);
            return insertedContacts;
        } catch (error) {
            throw new Error(`Error importing contacts: ${error.message}`);
        }       
    }

    /**
     * Update a contact by its ID
     * @param {string} _id - The ID of the contact to update
     * @param {contactInterface} data - Updated contact data
     * @returns {Promise<contactInterface | null>} A Promise resolving to the updated contact, or null if the contact with the provided ID is not found
     */

    public async updateContact(_id: string, data: contactInterface): Promise<contactInterface | null> {
        const existingContact = await contactModel.findById(_id);
        if (!existingContact) {
            throw new Error(MessageEnum.RECORD_NOT_FOUND);
        }
        return await contactModel.findOneAndUpdate({ _id }, data, { new: true });       
    }

    /**
     * Delete a contact
     * @param {string} _id - ID of the contact to delete
     * @returns {Promise<boolean>} A Promise resolving to true if the contact was deleted, otherwise throws an error
     */

    public async deleteContact(_id: string): Promise<boolean> {     
        const result = await contactModel.findOneAndDelete({ _id });
        if (result) {
            return true;
        } else {
            throw new Error(MessageEnum.RECORD_NOT_FOUND);
        }      
    }   
}
