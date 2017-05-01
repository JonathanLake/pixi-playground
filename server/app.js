'use strict';

const bodyParser = require('body-parser');
const express  = require('express');
const path = require('path');


const app = express();
const port = process.env.PORT || '8080'

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.listen(port);

module.exports = app;