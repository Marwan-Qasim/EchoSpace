const express = require('express');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth.route.js');
const messageRoute = require('./routes/message.route.js');
const path = require('path');


dotenv.config();
const __dirname = path.resolve();

const app = express();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (_, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
}

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => {
    console.log('Server is running on port',PORT);
});