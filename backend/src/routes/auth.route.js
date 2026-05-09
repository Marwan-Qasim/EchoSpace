import express from 'express';
<<<<<<< HEAD
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Signup endpoint');
});

router.get('/login', (req, res) => {
=======
import { signup } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', signup);

router.post('/login', (req, res) => {
>>>>>>> demo
    res.send('Login endpoint');
});

router.get('/logout', (req, res) => {
    res.send('Logout endpoint');
});

router.get('/update', (req, res) => {
    res.send('Update endpoint');
});

export default router;
