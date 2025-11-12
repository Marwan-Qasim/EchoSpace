const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Signup endpoint');


    
});

router.get('/login', (req, res) => {
    res.send('Login endpoint');
});   

router.get('/logout', (req, res) => {
    res.send('Logout endpoint');
}); 

router.get('/update', (req, res) => {
    res.send('Update endpoint');
}); 

module.exports = router;