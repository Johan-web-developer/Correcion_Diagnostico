const Pacientes = require('../models/Pacientes.js');

const getPacientes = async (req,res)=>{
    try {
        const pacientes = await Pacientes.find();
        res.json(pacientes)
    } catch (error) {
        res.status(404).send(error);
    }   
}

module.exports = 
getPacientes
