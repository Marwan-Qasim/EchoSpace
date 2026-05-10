import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import { setupSocket } from './lib/socket.js';
import cors from 'cors';
import { ENV } from './lib/env.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ENV.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

setupSocket(server);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);

server.listen(PORT, () => {
    console.log('Server is running on port', PORT);
    connectDB();
});

