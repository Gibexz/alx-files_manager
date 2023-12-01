const express = require('express');
const route = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use('/', route);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
