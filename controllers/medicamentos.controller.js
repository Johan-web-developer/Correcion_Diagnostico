const Medicamentos = require('../models/Medicamentos.js');

const getMedicamentos = async (req,res)=>{
    try {
        const medicamentos = await Medicamentos.find();
        const datafilter = medicamentos.filter((medicamentos)=>medicamentos.stock < 50);
        res.json(datafilter)
    } catch (error) {
        res.status(404).send(error);
    }   
}

module.exports = 
getMedicamentos
