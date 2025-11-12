import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
