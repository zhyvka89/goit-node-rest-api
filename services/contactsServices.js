import { where } from "sequelize";
import Contact from "../db/Contact.js";

export async function listContacts(userId) {
  return Contact.findAll({where: {
    owner: userId,
  }});
}

export async function getContactById(contactId, userId) {
  return Contact.findOne({where: {
    id: contactId,
    owner: userId,
  }});
}

export async function removeContact(contactId, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

export async function addContact(payload, userId) {
  return Contact.create({ ...payload, owner: userId });
}

export async function updateContact(contactId, payload, userId) {

  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return null;
  }
  await contact.update(payload);
  return contact;
}

export async function updateStatusContact(contactId, favorite, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return null;
  }
  contact.favorite = favorite;
  await contact.save();
  return contact;
}