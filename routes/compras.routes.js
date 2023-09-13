const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()

    router.get('/', async (req, res) => {
        const collection = db.collection('compras');
        const results = await collection.find({}).toArray();
        res.json(results);
    });


    module.exports = router;
