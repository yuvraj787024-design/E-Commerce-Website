const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const orderModel = require("../models/order.model");

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }

    });
}

async function getFoodPartnerOrders(req, res) {
    try {
        const orders = await orderModel.find({
            foodPartner: req.foodPartner._id
        })
        .populate("user", "fullName email")
        .populate("food", "name price image");

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = [
            "Pending",
            "Accepted",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await orderModel.findOneAndUpdate(
            {
                _id: id,
                foodPartner: req.foodPartner._id
            },
            {
                status
            },
            {
                new: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Status updated successfully",
            order
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getFoodPartnerById,
    getFoodPartnerOrders,
    updateOrderStatus
};