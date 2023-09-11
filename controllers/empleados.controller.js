const Empleados = require('../models/Empleados.js');

const getEmpleados = async (req,res)=>{
    try {
        const empleados = await Empleados.find();
        res.json(empleados)
    } catch (error) {
        res.status(404).send(error);
    }   
}

module.exports = 
getEmpleados 
