const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
