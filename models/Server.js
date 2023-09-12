const express = require('express');
const cors = require('cors');
const { connectDB } = require('../database/config.js');

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.port = process.env.PORT

        this.connectDB();

        this.routes();
    }
    
    async connectDB() {
        try {
            this.db = await connectDB();
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
        this.app.use('/api/medicamentos', require('../routes/medicamentos.routes')(this.db));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port : ${this.port}`);
        });
    }
}

module.exports = Server;
