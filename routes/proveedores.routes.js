const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()
    
    router.get('/contact',async (req,res)=>{
        try {
            const client = new MongoClient(bases,{useNewUrlParser:true, useUnifiedTopology:true});
            await client.connect();
            const db = client.db('farmaciaCampus');
            const collection = db.collection('Medicamentos');
    
            const result = await collection.distinct("proveedor");
            res.json(result);
            client.close();
        } catch (error) {
            res.status(404);
        }
    });
    router.get('/proveedorA',async (req,res)=>{
        try {
            const client = new MongoClient(bases,{useNewUrlParser:true, useUnifiedTopology:true});
            await client.connect();
            const db = client.db('farmaciaCampus');
            const collection = db.collection('Medicamentos');
            const result = await collection.find({'proveedor.nombre':'ProveedorA'}).toArray();
            res.json(result);
            client.close();
        } catch (error) {
            res.status(404);
        }
    });

    router.get('/total_medicamentos_por_proveedor', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const collection = db.collection('Ventas');
    
            const result = await collection.aggregate([
                { $unwind: "$medicamentosVendidos" },
                {
                    $group: {
                        _id: "$medicamentosVendidos.proveedor.nombre",
                        total: { $sum: "$medicamentosVendidos.cantidadVendida" }
                    }
                }
            ]).toArray();
    
            res.json(result);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/proveedores_sin_ventas_ultimo_anio', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const ventasCollection = db.collection('Ventas');
            const proveedoresCollection = db.collection('Proveedores');
    
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 365); // Restamos 365 días a la fecha actual
    
            // Encontrar proveedores que no han vendido medicamentos en el último año
            const proveedoresSinVentas = await proveedoresCollection.aggregate([
                {
                    $lookup: {
                        from: 'Ventas',
                        localField: 'nombre',
                        foreignField: 'proveedor.nombre',
                        as: 'ventas'
                    }
                },
                {
                    $match: {
                        ventas: { $not: { $elemMatch: { fechaVenta: { $gte: fechaLimite } } } }
                    }
                },
                {
                    $project: {
                        nombre: 1
                    }
                }
            ]).toArray();
    
            res.json(proveedoresSinVentas);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



    router.get('/ganancia_total_por_proveedor', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const comprasCollection = db.collection('Compras');
    
            const fechaInicio = new Date('2023-01-01T00:00:00.000Z');
            const fechaFin = new Date('2023-12-31T23:59:59.999Z'); 
    
            const gananciaPorProveedor = await comprasCollection.aggregate([
                {
                    $match: {
                        fechaCompra: {
                            $gte: fechaInicio,
                            $lte: fechaFin
                        }
                    }
                },
                {
                    $addFields: {
                        ganancia: {
                            $multiply: [
                                { $subtract: ["$precioVenta", "$precioCompra"] },
                                "$cantidadComprada"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$proveedor.nombre",
                        totalGanancia: { $sum: "$ganancia" }
                    }
                }
            ]).toArray();
    
            res.json(gananciaPorProveedor);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/proveedor_mas_suministros', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const medicamentosCollection = db.collection('Medicamentos');
    
            const proveedorConMasSuministros = await medicamentosCollection.aggregate([
                {
                    $sort: { stock: -1 }
                },
                {
                    $limit: 1
                },
                {
                    $project: {
                        proveedor: 1
                    }
                }
            ]).toArray();
    
            res.json(proveedorConMasSuministros[0]);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    router.get('/numero_proveedores_suministraron_2023', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const medicamentosCollection = db.collection('Medicamentos');
    
            const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
            const fin2023 = new Date('2023-12-31T23:59:59.999Z');
    
            const numeroProveedoresSuministraron2023 = await medicamentosCollection.distinct('proveedor.nombre', {
                "medicamentos.fechaExpiracion": {
                    $gte: inicio2023,
                    $lte: fin2023
                }
            });
    
            const totalProveedores = numeroProveedoresSuministraron2023.length;
    
            res.json({ totalProveedores });
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/proveedores_menos_de_50_unidades_en_stock', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const medicamentosCollection = db.collection('Medicamentos');
    
            const proveedoresMenosDe50Unidades = await medicamentosCollection.aggregate([
                {
                    $match: {
                        stock: { $lt: 50 }
                    }
                },
                {
                    $unwind: "$proveedor"
                },
                {
                    $group: {
                        _id: "$proveedor.nombre"
                    }
                }
            ]).toArray();
    
            res.json(proveedoresMenosDe50Unidades);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/proveedores_con_5_medicamentos_diferentes_2023', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const medicamentosCollection = db.collection('Medicamentos');
    
            const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
            const fin2023 = new Date('2023-12-31T23:59:59.999Z');
    
            const proveedoresCon5MedicamentosDiferentes = await medicamentosCollection.aggregate([
                {
                    $match: {
                        "proveedor.fechaSuministro": {
                            $gte: inicio2023,
                            $lte: fin2023
                        }
                    }
                },
                {
                    $group: {
                        _id: "$proveedor.nombre",
                        medicamentosDiferentes: { $addToSet: "$nombreMedicamento" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        cantidadMedicamentos: { $size: "$medicamentosDiferentes" }
                    }
                },
                {
                    $match: {
                        cantidadMedicamentos: { $gte: 5 }
                    }
                }
            ]).toArray();
    
            res.json(proveedoresCon5MedicamentosDiferentes);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
module.exports = router;

