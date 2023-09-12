// routes/medicamentos.js
const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentos.controller.js');

router.get('/stock-50', medicamentosController.getMedicamentosMenosDe50Stock);

module.exports = router;
