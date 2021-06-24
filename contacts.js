import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argv = process.argv;

const contactsPath = "./db/contacts.json";

// Функция, которая возвращает массив существующих контактов
async function listContacts() {
  const result = await fs.readFile(path.join(__dirname, contactsPath), "utf-8");
  return JSON.parse(result);
}

// Функция, которая возвращает контакт по заданному id
async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((el) => Number(el.id) === Number(contactId));
}

// Функция, которая удаляет контакт по заданному id и возвращает true, если контакт удалён и
// false, если контакт не найден
async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((el) => Number(el.id) === Number(contactId));
  if (idx !== -1) {
    contacts.splice(idx, 1);
    await fs.writeFile(
      path.join(__dirname, contactsPath),
      JSON.stringify(contacts)
    );
    return true;
  }
  return false;
}

// Функция, которая добавляет новый контакт
async function addContact(name, email, phone) {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  const content = JSON.parse(contacts);
  const id = nanoid(3);
  content.push({ id, name, email, phone });
  await fs.writeFile(contactsPath, JSON.stringify(content, null, 2));
}

export { addContact, removeContact, getContactById, listContacts };