const { Schema,model} = require('mongoose');


const CompraSchema = Schema({
    fechaCompra : {
        type: Date,
        required : true
    },
    proveedor : {
        type: Object,
        required : true 
    },
    medicamentosComprados : {
        type: Array,
        required : true
    },
});


module.exports = model('Compra',CompraSchema, 'Compras');