const Proveedores = require('../models/Medicamentos.js');

const getProveedores = async (req,res)=>{
    try {
        const proveedores = await Proveedores.find();
        res.json(proveedores)
    } catch (error) {
        res.status(404).send(error);
    }   
}

module.exports = 
getProveedores
