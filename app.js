const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {
  loadContacts,
  findContact,
  addContact,
  checkDuplicateEmail,
  deleteContact,
} = require('./utils/contacts');
const { check, body, validationResult } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Halaman Home',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman Tentang',
  });
});

app.get('/contact', (req, res) => {
  const contacts = loadContacts();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Halaman Kontak',
    contacts,
    msg: req.flash('msg'),
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layout',
    title: 'Tambah Data Kontak',
  });
});

app.post(
  '/contact',
  [
    body('email').custom((value) => {
      const duplikat = checkDuplicateEmail(value);
      if (duplikat) {
        throw new Error('Email sudah digunakan!');
      }
      return true;
    }),
    check('nama', 'Minimal 3 karakter').isLength({ min: 3 }),
    check('nohp', 'No Hp tidak valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Tambah Data Kontak',
        errors: errors.array(),
      });
    } else {
      const data = { id: new Date().getTime().toString(), ...req.body };
      addContact(data);
      req.flash('msg', 'Data kontak berhasil ditambahkan!');
      res.redirect('/contact');
    }
  }
);

app.get('/contact/delete/:id', (req, res) => {
  const contact = findContact(req.params.id);
  if (!contact) {
    res.status(404);
    res.send('<h1>404</h1>');
  } else {
    deleteContact(req.params.id);
    req.flash('msg', 'Data kontak berhasil dihapus!');
    res.redirect('/contact');
  }
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
