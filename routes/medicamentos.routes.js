// routes/medicamentos.js
const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()

router.get('/stock-50', async (req,res)=>{
    try {
        const client = new MongoClient(bases,{useNewUrlParser:true, useUnifiedTopology:true});
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Medicamentos');

        const result = await collection.find({"stock":{"$lt":50}}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});

router.get('/medicamentos_caducados', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Medicamentos');

        const fechaLimite = new Date('2024-01-01T00:00:00.000+00:00');

        const result = await collection.find({ fechaExpiracion: { $lt: fechaLimite } }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/total_dinero_recaudado', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const result = await collection.aggregate([
            { $unwind: "$medicamentosVendidos" },
            {
                $addFields: {
                    totalPorMedicamento: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDineroRecaudado: { $sum: "$totalPorMedicamento" }
                }
            }
        ]).toArray();

        res.json(result[0].totalDineroRecaudado);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_no_vendidos', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const medicamentosCollection = db.collection('Medicamentos');
        const ventasCollection = db.collection('Ventas');

        const medicamentosVendidos = await ventasCollection.distinct('medicamentosVendidos.nombreMedicamento');

        const medicamentosNoVendidos = await medicamentosCollection.find({ nombre: { $nin: medicamentosVendidos } }).toArray();

        res.json(medicamentosNoVendidos);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamento_mas_caro', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Medicamentos');

        const result = await collection.find().sort({ precio: -1 }).limit(1).toArray();

        res.json(result[0]);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_por_proveedor', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Medicamentos');

        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$proveedor.nombre",
                    totalMedicamentos: { $sum: 1 }
                }
            }
        ]).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/total_medicamentos_vendidos_marzo', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const fechaInicio = new Date('2023-03-01T00:00:00.000Z');
        const fechaFin = new Date('2023-03-31T23:59:59.999Z'); 

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
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: null,
                    totalMedicamentosVendidos: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            }
        ]).toArray();

        res.json(result[0].totalMedicamentosVendidos);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamento_menos_vendido', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Ventas');

        const fechaInicio = new Date('2023-01-01T00:00:00.000Z'); 
        const fechaFin = new Date('2023-12-31T23:59:59.999Z');

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
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: "$medicamentosVendidos.nombreMedicamento",
                    totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            },
            {
                $sort: {
                    totalVendido: 1
                }
            },
            {
                $limit: 1
            }
        ]).toArray();

        res.json(result[0]);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/promedio_medicamentos_por_venta', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');
        const comprasCollection = db.collection('Compras');

        // Obtener el total de medicamentos comprados
        const totalMedicamentosComprados = await comprasCollection.aggregate([
            {
                $unwind: "$medicamentosComprados"
            },
            {
                $group: {
                    _id: null,
                    totalMedicamentos: { $sum: "$medicamentosComprados.cantidadComprada" }
                }
            }
        ]).toArray();

        // Obtener el total de ventas
        const totalVentas = await ventasCollection.countDocuments();

        // Calcular el promedio
        const promedio = totalMedicamentosComprados[0].totalMedicamentos / totalVentas;

        res.json({ promedio });
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/medicamentos_expiran_2024', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const collection = db.collection('Medicamentos');

        const fechaInicio = new Date('2024-01-01T00:00:00.000Z');
        const fechaFin = new Date('2024-12-31T23:59:59.999Z'); 

        const result = await collection.find({
            fechaExpiracion: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_no_vendidos', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const medicamentosCollection = db.collection('Medicamentos');
        const ventasCollection = db.collection('Ventas');

        const medicamentosVendidos = await ventasCollection.distinct('medicamentosVendidos.nombreMedicamento');
        const medicamentosNoVendidos = await medicamentosCollection.find({
            nombre: { $nin: medicamentosVendidos }
        }).toArray();

        res.json(medicamentosNoVendidos);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/total_medicamentos_vendidos_por_mes_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
        const fin2023 = new Date('2023-12-31T23:59:59.999Z');

        const totalMedicamentosPorMes = await ventasCollection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: inicio2023,
                        $lte: fin2023
                    }
                }
            },
            {
                $project: {
                    mes: { $month: "$fechaVenta" },
                    cantidadVendida: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            },
            {
                $group: {
                    _id: "$mes",
                    total: { $sum: "$cantidadVendida" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).toArray();

        res.json(totalMedicamentosPorMes);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_vendidos_por_mes_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
        const fin2023 = new Date('2023-12-31T23:59:59.999Z');

        const medicamentosVendidosPorMes = await ventasCollection.aggregate([
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
                    _id: {
                        mes: { $month: "$fechaVenta" },
                        nombreMedicamento: "$medicamentosVendidos.nombreMedicamento"
                    },
                    totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            },
            {
                $sort: { "_id.mes": 1, totalVendido: -1 }
            }
        ]).toArray();

        res.json(medicamentosVendidosPorMes);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_no_vendidos_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const medicamentosCollection = db.collection('Medicamentos');
        const ventasCollection = db.collection('Ventas');

        const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
        const fin2023 = new Date('2023-12-31T23:59:59.999Z');

        const medicamentosVendidos2023 = await ventasCollection.distinct('medicamentosVendidos.nombreMedicamento', {
            "fechaVenta": {
                $gte: inicio2023,
                $lte: fin2023
            }
        });

        const medicamentosNoVendidos2023 = await medicamentosCollection.find({
            "nombreMedicamento": { $nin: medicamentosVendidos2023 }
        }).toArray();

        res.json(medicamentosNoVendidos2023);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/total_medicamentos_primer_trimestre_2023', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const ventasCollection = db.collection('Ventas');

        const inicioPrimerTrimestre = new Date('2023-01-01T00:00:00.000Z');
        const finPrimerTrimestre = new Date('2023-03-31T23:59:59.999Z');

        const totalMedicamentosPrimerTrimestre = await ventasCollection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: inicioPrimerTrimestre,
                        $lte: finPrimerTrimestre
                    }
                }
            },
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: null,
                    totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            }
        ]).toArray();

        res.json(totalMedicamentosPrimerTrimestre[0].totalVendido);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/medicamentos_precio_mayor_50_stock_menor_100', async (req, res) => {
    try {
        const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('farmaciaCampus');
        const medicamentosCollection = db.collection('Medicamentos');

        const medicamentosFiltrados = await medicamentosCollection.find({
            "precio": { $gt: 50 },
            "stock": { $lt: 100 }
        }).toArray();

        res.json(medicamentosFiltrados);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
