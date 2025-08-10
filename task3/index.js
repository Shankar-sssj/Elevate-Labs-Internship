const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // parse JSON bodies

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho' },
  { id: 2, title: '1984', author: 'George Orwell' },
];

const getNextId = () =>
  books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;

const findBook = id => books.find(b => b.id === Number(id));


app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/books', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author || !title.toString().trim() || !author.toString().trim()) {
    return res.status(400).json({ error: 'title and author are required' });
  }

  const newBook = { id: getNextId(), title: title.toString().trim(), author: author.toString().trim() };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author } = req.body;

  if (title && title.toString().trim()) book.title = title.toString().trim();
  if (author && author.toString().trim()) book.author = author.toString().trim();

  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });

  books.splice(idx, 1);
  // 204 No Content is appropriate for a successful delete with no body
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
