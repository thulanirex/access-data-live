const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();

// Use history API fallback
app.use(history());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});
