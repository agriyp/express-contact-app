const fs = require('fs');

// buat folder jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// buat contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// baca file contacts.json
const loadContacts = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// cari contact berdasarkan id
const findContact = (id) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact;
};

// menimpa semua file contacts.json
const saveContact = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// menambahkan contact
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContact(contacts);
};

// cek duplikat email
const checkDuplicateEmail = (email) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.email === email);
};

// hapus kontak
const deleteContact = (id) => {
  const contacts = loadContacts();
  const filteredContact = contacts.filter((contact) => contact.id !== id);
  saveContact(filteredContact);
};

module.exports = { loadContacts, findContact, addContact, checkDuplicateEmail, deleteContact };
