const express = require('express');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth.route.js');
const messageRoute = require('./routes/message.route.js');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;



app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => {
    console.log('Server is running on port',PORT);
});