const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/daily', reportController.dailyReport);
router.get('/monthly', reportController.monthlyReport);
router.get('/dashboard', reportController.dashboardStats);

module.exports = router;
