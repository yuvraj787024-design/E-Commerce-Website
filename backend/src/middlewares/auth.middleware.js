const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");


async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)



        const foodPartner = await foodPartnerModel.findById(decoded.id);

        req.foodPartner = foodPartner

                if (!foodPartner) {
    return res.status(401).json({
        message: "Food Partner not found"
    });
}

        next()

    } catch (err) {
    console.log(err);

    return res.status(401).json({
        message: err.message
    });
}

}

async function authUserMiddleware(req, res, next) {
   const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if (!user) {
    return res.status(401).json({
        message: "User not found"
    });
}

        req.user = user

        next()

    } catch (err) {
    console.log(err);

    return res.status(401).json({
        message: err.message
    });
}

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}