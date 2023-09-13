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

router.get('/proveedor',async (req,res)=>{
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

module.exports = router;
