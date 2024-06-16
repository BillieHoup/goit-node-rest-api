import mongoose from "mongoose";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user.id);
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Internal server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const contact = await getContactById(id);

    if (!contact || contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }

    const contact = await getContactById(id);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(403, "Forbidden! Contact does not belong to the user");
    }

    const deletedContact = await removeContact(req.user.id, id);

    if (!deletedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await addContact({ ...req.body, owner: req.user.id });
    res.status(201).json(newContact);
  } catch (error) {
    next(HttpError(500, "Failed to create contact"));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const contact = await getContactById(id);

    if (!contact || contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    const updatedContact = await updateContactService(id, req.body);

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const contact = await getContactById(id);

    if (!contact || contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    const updatedContact = await updateStatusContact(id, req.body.favorite);

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
