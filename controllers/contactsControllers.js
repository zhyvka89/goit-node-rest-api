import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactWithNewFields,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = (req, res) => {
  const contacts = listContacts();
  res.json({
    status: "success",
    code: 200,
    data: { contacts },
  });
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  const contact = getContactById(id);
  if (contact) {
    res.json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const removedContact = removeContact(id);
  if (removedContact) {
    res.json({
      status: "success",
      code: 200,
      data: { removedContact },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
    });
  }
  const newContact = addContact(name, email, phone);
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });
};

export const updateContact = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Body must have at least one field",
    });
  }
  const { id } = req.params;
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
    });
  }
  const updatedContact = updateContactWithNewFields(id, req.body);
  if (updatedContact) {
    res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } else {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};
