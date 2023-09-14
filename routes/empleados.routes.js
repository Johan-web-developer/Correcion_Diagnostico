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

router.get('/empleados_menos_de_5_ventas_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
        const fin2023 = new Date('2023-12-31T23:59:59.999Z');

        const empleadosMenosDe5Ventas = await ventasCollection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: inicio2023,
                        $lte: fin2023
                    }
                }
            },
            {
                $group: {
                    _id: "$empleado.nombre",
                    cantidadVendida: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalVentas: { $lt: 5 }
                }
            }
        ]).toArray();

        res.json(empleadosMenosDe5Ventas);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/empleado_mayor_variedad_medicamentos_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
        const fin2023 = new Date('2023-12-31T23:59:59.999Z');

        const empleadoMayorVariedad = await ventasCollection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: inicio2023,
                        $lte: fin2023
                    }
                }
            },
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: "$empleado.nombre",
                    medicamentosDistintos: { $addToSet: "$medicamentosVendidos.nombreMedicamento" }
                }
            },
            {
                $project: {
                    _id: 1,
                    cantidadMedicamentos: { $size: "$medicamentosDistintos" }
                }
            },
            {
                $sort: { cantidadMedicamentos: -1 }
            },
            {
                $limit: 1
            }
        ]).toArray();

        res.json(empleadoMayorVariedad);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/empleados_sin_ventas_abril_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicioAbril2023 = new Date('2023-04-01T00:00:00.000Z');
        const finAbril2023 = new Date('2023-04-30T23:59:59.999Z');

        const empleadosConVentasAbril = await ventasCollection.distinct('empleado.nombre', {
            "fechaVenta": {
                $gte: inicioAbril2023,
                $lte: finAbril2023
            }
        });

        const todosLosEmpleados = await db.collection('Pacientes').distinct('nombre');

        const empleadosSinVentasAbril = todosLosEmpleados.filter(empleado => !empleadosConVentasAbril.includes(empleado));

        res.json(empleadosSinVentasAbril);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
