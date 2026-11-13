const express = require('express');
const router = express.Router();
const { getMonthlyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/monthly', getMonthlyReport);
router.get('/category-summary', getMonthlyReport);
router.get('/balance', getMonthlyReport);

module.exports = router;
