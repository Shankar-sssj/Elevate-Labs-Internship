// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// --- In-memory "database"
let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho' },
  { id: 2, title: '1984', author: 'George Orwell' },
];

// --- Helpers
const getNextId = () =>
  books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;

const findBook = id => books.find(b => b.id === Number(id));

// --- Routes

// GET /books - list all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id - get one book
app.get('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST /books - create a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;

  // basic validation
  if (!title || !author || !title.toString().trim() || !author.toString().trim()) {
    return res.status(400).json({ error: 'title and author are required' });
  }

  const newBook = { id: getNextId(), title: title.toString().trim(), author: author.toString().trim() };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - update a book (partial updates allowed)
app.put('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author } = req.body;

  if (title && title.toString().trim()) book.title = title.toString().trim();
  if (author && author.toString().trim()) book.author = author.toString().trim();

  res.json(book);
});

// DELETE /books/:id - remove a book
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });

  books.splice(idx, 1);
  // 204 No Content is appropriate for a successful delete with no body
  res.status(204).send();
});

// --- Error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// --- Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
