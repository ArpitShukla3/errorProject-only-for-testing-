const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const LOG_FILE = path.join(__dirname, 'error.log');

const logError = (error, req) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.url} - ${error.message}\nStack: ${error.stack}\n\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
  console.error(`Error logged: ${error.message}`);
};

app.use(express.json());

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = undefined;
  res.json(user.name);
});

app.post('/api/calculate', (req, res) => {
  const { numbers } = req.body;
  const result = numbers.reduce((acc, num) => acc + num, 0);
  res.json({ result });
});

app.get('/api/data', async (req, res) => {
  const data = await fetch('http://invalid-url-that-does-not-exist.com');
  res.json(data);
});

app.put('/api/update/:id', (req, res) => {
  const config = JSON.parse('invalid json');
  res.json(config);
});

app.use((err, req, res, next) => {
  logError(err, req);
  res.status(500).json({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Buggy APIs:');
  console.log('  GET  /api/users/:id');
  console.log('  POST /api/calculate');
  console.log('  GET  /api/data');
  console.log('  PUT  /api/update/:id');
});
