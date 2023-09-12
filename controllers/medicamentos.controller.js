// controladores/medicamentosController.js
const getMedicamentosMenosDe50Stock = async (req, res) => {
    try {
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
