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
const loadContact = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// cari contact berdasarkan id
const findContact = (id) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.id === id);
  return contact;
};

module.exports = { loadContact, findContact };
