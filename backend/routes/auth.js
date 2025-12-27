    const express = require('express');
    const jwt = require('jsonwebtoken');

    const router = express.Router();

    router.get('/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json(user);
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
    });

    module.exports = router;
