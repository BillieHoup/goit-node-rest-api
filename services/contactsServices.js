import Contact from '../models/contacts.js';

const listContacts = () => Contact.find();

const getContactById = contactId => Contact.findById(contactId);

const removeContact = contactId => Contact.findByIdAndDelete(contactId);

const addContact = contactData => Contact.create(contactData);

const updateContact = (contactId, updateFields) =>
  Contact.findByIdAndUpdate(contactId, updateFields, { new: true });

const updateStatusContact = (contactId, favorite) =>
  Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
