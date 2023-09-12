// Asegúrate de que la importación de 'db' sea correcta
const { db } = require('../database/config.js');
const { MongoClient } = require('mongodb');

client = new MongoClient(dbConfig.mongoURL)

const getMedicamentosMenosDe50Stock = async (req, res) => {
    try {
        // Asegúrate de que el nombre de la colección sea correcto ('medicamentos')
        const collection = db.collection('Medicamentos');
        const medicamentos = await collection.find({ stock: { $lt: 50 } }).toArray();
        res.json(medicamentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getMedicamentosMenosDe50Stock
};
