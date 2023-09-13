// server.js
const express = require('express');
const router = express.Router();
const routerMedicamentos = require('../routes/medicamentos.routes');
const routerVentas = require('../routes/ventas.routes');
const routerPacientes = require('../routes/pacientes.routes');
const routerEmpleados = require('../routes/empleados.routes');
const routerCompras = require('../routes/compras.routes');
const routerProveedores = require('../routes/proveedores.routes');

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.port = process.env.PORT;
        this.routes();
    }


    middleware() {
        this.app.use(express.json());
    }
    routes() {
        this.app.use('/api/medicamentos', routerMedicamentos);
        this.app.use('/api/proveedores', routerProveedores);
        this.app.use('/api/pacientes', routerPacientes);
        this.app.use('/api/empleados', routerEmpleados);
        this.app.use('/api/compras', routerCompras);
        this.app.use('/api/ventas', routerVentas);

    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port : ${this.port}`);
        });
    }
}

module.exports = Server;
