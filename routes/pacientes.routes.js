module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    router.get('/', async (req, res) => {
        const collection = db.collection('pacientes');
        const results = await collection.find({}).toArray();
        res.json(results);
    });

    return router;
};
