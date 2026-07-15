const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email server:", error);
    } else {
        console.log("For Orders,  Email server is ready to send messages");
    }
});

async function sendOrderEmail(foodPartnerEmail, foodName, price, customerName, address, paymentType) {
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            to: foodPartnerEmail,
            subject: "🍽️ New Food Order Received",
            html: `
                <div style="font-family: Arial, sans-serif; padding:20px;">
                    <h2 style="color:#28a745;">New Order Received</h2>

                    <p>You have received a new food order.</p>

                    <table style="border-collapse:collapse;">
                        <tr>
                            <td><b>Customer</b></td>
                            <td>${customerName}</td>
                        </tr>

                        <tr>
                            <td><b>Food</b></td>
                            <td>${foodName}</td>
                        </tr>

                        <tr>
                            <td><b>Food</b></td>
                            <td>${price}</td>
                        </tr>

                        <tr>
                            <td><b>Delivery Address</b></td>
                            <td>${address}</td>
                        </tr>

                        <tr>
                            <td><b>Payment Type</b></td>
                            <td>${paymentType}</td>
                        </tr>
                    </table>

                    <br>

                    <p>Please prepare the order.</p>

                    <h3>Thank you.</h3>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

    } catch (err) {
        console.log("Order Email Error:", err.message);
    }
}

module.exports = {
    sendOrderEmail
};