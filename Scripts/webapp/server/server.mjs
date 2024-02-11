import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
