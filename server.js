const express = require('express');
const route = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json()); // To parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.use('/', route);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
