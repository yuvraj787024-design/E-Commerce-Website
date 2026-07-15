const orderModel = require("../models/order.model");
const food = require("../models/food.model");
const orderEmailService = require("../services/orderEmail.service");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");

async function orderFood(req, res) {
    try {
        const { foodId, address, paymentType } = req.body;

        if (!foodId || !address || !paymentType) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const foodItem = await food.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({
                message: "Food not found"
            });
        }


        const order = await orderModel.create({
            user: req.user._id,
            foodPartner: foodItem.foodPartner,
            food: foodItem._id,
            price: foodItem.price,
            address,
            paymentType,
            status: "Pending"
        });

        const partner = await foodPartnerModel.findById(foodItem.foodPartner);

        const customer = await userModel.findById(req.user._id);

await orderEmailService.sendOrderEmail(
    partner.email,
    foodItem.name,
    foodItem.price,
    customer.fullName,
    address,
    paymentType
);

        return res.status(201).json({
            message: "Ordered Successfully",
            order
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

async function getOrderFood(req, res) {
    try {
        const orderItems = await orderModel.find({
            user: req.user._id
        })
        .populate("user")
        .populate("food")
        .populate("foodPartner");

        return res.status(200).json({
            message: "Orders fetched successfully",
            orderItems
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

async function cancelOrderFood(req, res) {
    try {
        const { id } = req.params;

        const order = await orderModel.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            {
                status: "Cancelled"
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
            message: "Order cancelled successfully",
            order
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    orderFood,
    getOrderFood,
    cancelOrderFood
}
