const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();

router.get('/empleados_mas_de_5_ventas', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$empleado.nombre",
                    totalVentas: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalVentas: { $gt: 5 }
                }
            }
        ]).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
