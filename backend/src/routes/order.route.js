const express = require('express')
const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

router.post("/orderFood", authMiddleware.authUserMiddleware ,orderController.orderFood);
router.get("/getOrders",authMiddleware.authUserMiddleware ,orderController.getOrderFood)
router.delete("/cancelOrder/:id", authMiddleware.authUserMiddleware ,orderController.cancelOrderFood)

module.exports = router