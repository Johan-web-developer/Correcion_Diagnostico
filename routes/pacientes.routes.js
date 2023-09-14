const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()

    router.get('/pacientes_que_compraron_paracetamol', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const collection = db.collection('Ventas');
    
            const result = await collection.distinct('paciente.nombre', { 'medicamentosVendidos.nombreMedicamento': 'Paracetamol' });
    
            res.json(result);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/pacientes_compraron_paracetamol_2023', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const ventasCollection = db.collection('Ventas');
    
            const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
            const fin2023 = new Date('2023-12-31T23:59:59.999Z');
    
            const pacientesCompraronParacetamol = await ventasCollection.distinct('paciente.nombre', {
                "fechaVenta": {
                    $gte: inicio2023,
                    $lte: fin2023
                },
                "medicamentosVendidos.nombreMedicamento": "Paracetamol"
            });
    
            res.json(pacientesCompraronParacetamol);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    router.get('/pacientes_sin_compras_2023', async (req, res) => {
        try {
            const client = new MongoClient(bases, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('farmaciaCampus');
            const ventasCollection = db.collection('Ventas');
    
            const inicio2023 = new Date('2023-01-01T00:00:00.000Z');
            const fin2023 = new Date('2023-12-31T23:59:59.999Z');
    
            const pacientesConCompras2023 = await ventasCollection.distinct('paciente.nombre', {
                "fechaVenta": {
                    $gte: inicio2023,
                    $lte: fin2023
                }
            });
    
            const todosLosPacientes = await db.collection('Pacientes').distinct('nombre');
    
            const pacientesSinCompras2023 = todosLosPacientes.filter(paciente => !pacientesConCompras2023.includes(paciente));
    
            res.json(pacientesSinCompras2023);
            client.close();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    module.exports = router;