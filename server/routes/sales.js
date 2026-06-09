const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', saleController.getSales);
router.get('/all', saleController.getAllSales);
router.get('/:id', saleController.getSale);
router.post('/', saleController.createSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;
