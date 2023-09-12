// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const medicamentosRoutes = require('../routes/medicamentos.routes');

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.port = process.env.PORT;

        this.connectDB();

        this.routes();
    }

    async connectDB() {
            let db;
            const url = 'mongodb+srv://user:12345@farmacia.xoypicz.mongodb.net/';
            const client = new MongoClient(url);
            const dbName = "farmaciaCampus";
            // Conexion
            client.connect().then(() => {
                db = client.db(dbName);
                console.log("Conectado a la base de datos");
            }).catch(error => {
                console.error("Error conectando a la base de datos:", error);
            });
            
    }

    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/api/medicamentos', medicamentosRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port : ${this.port}`);
        });
    }
}

module.exports = Server;
