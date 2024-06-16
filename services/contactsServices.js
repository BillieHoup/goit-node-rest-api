import Contact from "../models/contacts.js";

const listContacts = (userId) => Contact.find({ owner: userId });

const getContactById = (userId, contactId) =>
  Contact.findOne({ _id: contactId, owner: userId });

const removeContact = (userId, contactId) =>
  Contact.findOneAndDelete({ _id: contactId, owner: userId });

const addContact = (contactData) => Contact.create(contactData);

const updateContact = (userId, contactId, updateFields) =>
  Contact.findOneAndUpdate({ _id: contactId, owner: userId }, updateFields, {
    new: true,
  });

const updateStatusContact = (userId, contactId, favorite) =>
  Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true }
  );

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
