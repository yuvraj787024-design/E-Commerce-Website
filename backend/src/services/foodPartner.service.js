const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email server:", error);
    } else {
        console.log("Food Partner Email server is ready to send messages");
    }
});

async function sendEmail(to, subject, text, html) {
    await transporter.sendMail({
        from: `"Fruit Delivery App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });
}

async function sendFoodPartnerRegistrationEmail(
    partnerName,
    partnerEmail,
    partnerId
) {
    const subject = "Food Partner Registration Successful";

    const text = `
Welcome ${partnerName},

Congratulations! Your Food Partner account has been created successfully.

Partner ID: ${partnerId}

You can now log in and start managing your deliveries.

Regards,
Fruit Delivery Team
`;

    const html = `
    <h2>Welcome ${partnerName}</h2>

    <p>Your Food Partner account has been registered successfully.</p>

    <table border="1" cellpadding="8" cellspacing="0">
        <tr>
            <td><b>Partner ID</b></td>
            <td>${partnerId}</td>
        </tr>

        <tr>
            <td><b>Email</b></td>
            <td>${partnerEmail}</td>
        </tr>
    </table>

    <br>

    <p>You can now log in and start accepting delivery requests.</p>

    <br>

    <p>Regards,<br><b>Fruit Delivery Team</b></p>
    `;

    await sendEmail(partnerEmail, subject, text, html);
}

module.exports = {
    sendFoodPartnerRegistrationEmail,
};