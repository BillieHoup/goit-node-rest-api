import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateFavorite,
} from '../controllers/contactsControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:id', getOneContact);
contactsRouter.delete('/:id', deleteContact);
contactsRouter.post('/', validateBody(createContactSchema), createContact);
contactsRouter.put('/:id', validateBody(updateContactSchema), updateContact);
contactsRouter.patch(
  '/:id/favorite',
  validateBody(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;
