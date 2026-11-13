const express = require('express');
const router = express.Router();
const { recordSettlement, getSettlements } = require('../controllers/settlementController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(recordSettlement).get(getSettlements);

module.exports = router;

