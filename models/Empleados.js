const { Schema,model} = require('mongoose');


const EmpleadoSchema = Schema({
    nombre : {
        type: String,
        required : true
    },
    cargo : {
        type: String,
        required : true 
    },
    fechaContratacion : {
        type: String,
        required : true
    },
});


module.exports = model('Empleado',EmpleadoSchema, 'Empleados');