import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactWithNewFields,
  updateStatusContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from '../helpers/HttpError.js';

export const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    code: statusCode,
    data,
  });
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const contacts = await listContacts(user.id);
    return sendResponse(res, 200, contacts );
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const { id } = req.params;
    const contact = await getContactById(id, user.id);
    if (!contact) {
      return next(HttpError(404, "Not found"));
    }
    return sendResponse(res, 200, contact );
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const { id } = req.params;
    const removedContact = await removeContact(id, user.id);
    if (!removedContact) {
      return next(HttpError(404, "Not found"));
    }
    return sendResponse(res, 200, removedContact );
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const { error } = createContactSchema.validate(req.body);
    if(error) {
      return next(HttpError(400, error.details[0].message));
    }
    const newContact = await addContact(req.body, user.id);
    return sendResponse(res, 201,  newContact );
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next(HttpError(400, "Body must have at least one field"));
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.details[0].message));
    }
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const { id } = req.params;
    const updatedContact = await updateContactWithNewFields(id, req.body, user.id);
    if (!updatedContact) {
      return next(HttpError(404, "Not found"));
    }
    return sendResponse(res, 200, updatedContact );
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.details[0].message));
    }
    const { user } = req;
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    const { id } = req.params;
    const { favorite } = req.body;
    const updatedContact = await updateStatusContact(id, favorite, user.id);
    if (!updatedContact) {
      return next(HttpError(404, "Not found"));
    }
    return sendResponse(res, 200, updatedContact );
  } catch (error) {
    next(error);
  } 
};
