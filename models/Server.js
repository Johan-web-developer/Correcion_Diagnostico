const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.port = process.env.PORT
        this.medicamentos = "/api/medicamentos";
        this.proveedores = "/api/proveedores";  
        this.empleados = "/api/empleados";
        this.pacientes = "/api/pacientes";
        this.compras = "/api/compras"

        this.conectDB();

        this.routes();
    }
    
    async conectDB() {
        try {
            const client = await MongoClient.connect('mongodb+srv://user:12345@farmacia.xoypicz.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
            this.db = client.db('farmaciaCampus');
            console.log('Connected to database');
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }
    
    middleware() {
        // CORS 
        this.app.use(cors());
        // Leer y parsear JSON en BODY
        this.app.use(express.json());
    }
    
    routes() {
        this.app.use(this.medicamentos, require('../routes/medicamentos.routes.js')(this.db));
        this.app.use(this.proveedores, require('../routes/proveedores.routes.js')(this.db));
        this.app.use(this.empleados, require('../routes/empleados.routes.js')(this.db));
        this.app.use(this.pacientes, require('../routes/pacientes.routes.js')(this.db));
        this.app.use(this.compras, require('../routes/compras.routes.js')(this.db));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port : ${this.port}`);
        });
    }
}

module.exports = Server;
