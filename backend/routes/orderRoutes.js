const express = require("express");

const { createOrder,
     getUserOrders,
     getAllOrders
    } = require("../controllers/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.get("/user/:email", getUserOrders);
router.get("/", getAllOrders);

module.exports = router;
