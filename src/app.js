const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
