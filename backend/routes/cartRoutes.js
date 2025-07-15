const express = require('express');
const router = express.Router();
const {addcart, getcart,increaseQuantity,decreaseQuantity}=require('../controllers/cartController')

router.post('/add',addcart)
router.get('/:email',getcart)
router.put('/increase/:itemId', increaseQuantity);
router.put('/decrease/:itemId', decreaseQuantity);

module.exports = router;