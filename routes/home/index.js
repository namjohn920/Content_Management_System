const express = require('express');
const router = express.Router();

//Routes
router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'main';
    next();
});

router.get('/', (req,res) => {
    res.render('home/index');
});

router.get('/login', (req,res) => {
    res.render('home/login');
});

router.get('/register', (req,res) => {
    res.render('home/register');
});

module.exports = router;
 