const express = require('express');
const router = express.Router();
const {addcart, getcart,increaseQuantity,decreaseQuantity,deleteproduct}=require('../controllers/cartController')

router.post('/add',addcart)
router.get('/:email',getcart)
router.put('/increase/:itemId', increaseQuantity);
router.put('/decrease/:itemId', decreaseQuantity);
router.delete('/delete/:id',deleteproduct)

module.exports = router;