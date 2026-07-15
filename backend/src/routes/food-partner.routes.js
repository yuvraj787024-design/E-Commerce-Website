const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* Get all orders of logged-in food partner */
router.get(
    "/orders",
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getFoodPartnerOrders
);

/* Update order status */
router.patch(
    "/orders/:id/status",
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.updateOrderStatus
);

/* Get food partner by id (KEEP THIS LAST) */
router.get(
    "/:id",
    foodPartnerController.getFoodPartnerById
);

module.exports = router;