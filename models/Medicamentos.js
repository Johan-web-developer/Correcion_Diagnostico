const { Schema,model} = require('mongoose');


const MedicamentosSchema = Schema({
    nombre : {
        type: String,
        required : true
    },
    precio : {
        type: String,
        required : true 
    },
    stock : {
        type: String,
        required : true
    },
    fechaExpiracion:{
        type: Date,
        required:true
    },
    proveedor:{
        type: Object,
        required: true
    }
});


module.exports = model('Medicamento',MedicamentosSchema, 'Medicamentos');