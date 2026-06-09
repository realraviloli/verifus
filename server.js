const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const PORT = 8080;
const LICENSE_DURATION_MS = 60 * 60 * 1000;

const app = express();

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const requestTime = new Date().toISOString();
  const code = req.body.code || 'N/A';
  const userAgent = req.get('User-Agent') || 'N/A';
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  console.log('=== Request Log ===');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`IP: ${clientIP}`);
  console.log(`Time: ${requestTime}`);
  console.log(`Code: ${code}`);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`URL: ${fullUrl}`);
  console.log(`Body:`, req.body);
  console.log('==================');

  next();
});

// POST /camera/useTimeCode endpoint
app.post('/camera/useTimeCode', (req, res) => {
  const now = Math.floor(Date.now() / 1000); // Unix time in seconds
  const expiredTime = Date.now() + LICENSE_DURATION_MS; // Current time + 1 hour in milliseconds
  
  // Generate random 32-character token
  const token = crypto.randomBytes(16).toString('hex');

  const response = {
    code: 200,
    now: now,
    remain: 0,
    ns: 0,
    expiredTime: expiredTime,
    token: token,
    data: "yXDu8TcirdugPVmeDSFc6o8bf9Mgcg7QwVLmG0qUY7dbnpxF6LsK/7lA7WlFqq/X8pzKUk3R+bYDCk4aCW56BER0jJErq+kRSzh6zxiBoMMe6JjFWW3aVLgVz7yeqdzHzQnnDGTDWgKpxYHti1xi5dtI5RVMp7F8WZn1jwyroX+igV58YABPwy416c6mxYFRZYgJChaDDgMf8ESu5u8mo9x2zkOw/gUK3CeDueK/xT0D5T0gO4iZXRR326zd9NnEAHSlpeIYRrJsmZC6mw4htoqREv9Ol7BTm1+g5bPq6HvZdQ93/yb8JIeVW44R9++WSdq40U8iKGbuIl4Y0wSakg==",
    sig: "NP5+UZEO6XQ5W6S35KqgqK5zNW7vAwVWQdYlclH+xJdurTrpopeDh4UxNUtKlITIHAxhPK8BRlFr58EWSJiCBl/Ode/nHNMzyELfUoAI/qoDOMliKxRPf5E5iQJIAmsx3SMEFzwYzjTYpBdhAHsPGDvUbVhpkxN0kU9qCGAbWWIeYBid16oaE5rd62H2TlqIGKVLO6wdj5dgsf18mKznSQA4IV+tMxcREaX5odWUNS6DC+ln69Q+g8BCvWo+MSahEX+588dXQR4qKsWTqyKf9gMc+TX63AwvmrGcFCjh0vz4+j4QFIpX/nRagmkBYct1K/aK1TEJzOGKKglwZTFINg=="
  };

  res.json(response);
});

// POST /camera/device endpoint
app.post('/camera/device', (req, res) => {
  const response = {
    code: 200,
    message: "ok"
  };

  res.json(response);
});

// GET /health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /camera/:name.txt endpoint
app.get('/camera/:name.txt', (req, res) => {
  console.log('TXT:', req.params.name);
  res.type('text/plain');
  res.send('OK');
});

// GET /chmp4.html endpoint
app.get('/chmp4.html', (req, res) => {
  console.log('HTML requested');
  res.send(`
    <html>
        <body>OK</body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`License server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
