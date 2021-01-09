require('dotenv').config();
const express = require('express');
const restaurantRoutes = require('./routes/restaurants');

const app = express();

// use restaurantRoutes endpoints
app.use(restaurantRoutes); 

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));