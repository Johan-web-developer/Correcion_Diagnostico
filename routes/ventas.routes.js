const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()

router.get('/receta', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas'); // Cambia el nombre de la colección si es diferente

        const result = await collection.find({ fechaVenta: { $gte: new Date('2023-01') } }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({ error: "no se encontro" }); // Cambié el código de estado a 500 para indicar un error interno del servidor.
    }
});

router.get('/total_ventas_paracetamol', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const result = await collection.aggregate([
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $match: {
                    "medicamentosVendidos.nombreMedicamento": "Paracetamol"
                }
            },
            {
                $group: {
                    _id: null,
                    total_cantidad: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            }
        ]).toArray();

        if (result.length > 0) {
            res.json(result[0].total_cantidad);
        } else {
            res.json(0);
        }

        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ventas_por_empleado', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const fechaInicio = new Date('2023-01-01T00:00:00.000Z'); // Primero de enero de 2023
        const fechaFin = new Date('2023-12-31T23:59:59.999Z'); // Último de diciembre de 2023

        const result = await collection.aggregate([
            {
                $match: {
                    fechaVenta: {
                        $gte: fechaInicio,
                        $lte: fechaFin
                    }
                }
            },
            {
                $group: {
                    _id: "$empleado.nombre",
                    totalVentas: { $sum: 1 }
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
