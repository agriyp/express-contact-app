const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact } = require('./utils/contacts');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
  const contacts = [
    {
      name: 'John Doe',
      email: 'jdoe@me.com',
      phone: '555-555-5555',
    },
    {
      name: 'Jane Ohano',
      email: 'janee@me.com',
      phone: '555-666-5555',
    },
  ];

  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Halaman Home',
    contacts,
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman Tentang',
  });
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Kontak',
    contacts,
  });
});

app.get('/contact/:id', (req, res) => {
  const contact = findContact(req.params.id);
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Kontak',
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('<h1>Halaman tidak ditemukan</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
