require('dotenv').config();
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// parse JSON (application/json content-type)
app.use(bodyParser.json());

const cors = require('cors');
const path = require('path');

const restaurantRoutes = require('./routes/restaurants');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const profileRoutes = require('./routes/profiles');

app.use(userRoutes);
app.use(roomRoutes);
app.use(profileRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
