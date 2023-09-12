const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentos.controller');

// Define las rutas para los medicamentos aquí
router.get('/', medicamentosController.getMedicamentosMenosDe50Stock);

module.exports = router;
