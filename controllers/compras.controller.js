const Compras = require('../models/Compras.js');

const getCompras = async (req,res)=>{
    try {
        const compras = await Compras.find();
        res.json(compras)
    } catch (error) {
        res.status(404).send(error);
    }   
}

module.exports = 
getCompras 
