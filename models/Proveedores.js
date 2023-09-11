const { Schema,model} = require('mongoose');


const ProveedoresSchema = Schema({
    nombre : {
        type: String,
        required : true
    },
    contacto: {
        type: String,
        required : true 
    },
    direccion : {
        type: String,
        required : true
    },
});


module.exports = model('Proveedores',ProveedoresSchema);