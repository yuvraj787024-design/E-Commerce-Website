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
        console.log("User Email server is ready to send messages");
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

async function sendRegistrationEmail(
    userName,
    userEmail,
    userId
) {
    const subject = "Welcome to Fruit Delivery App!";

    const text = `
Hello ${userName},

Welcome to Fruit Delivery App!

Your account has been created successfully.

User ID: ${userId}

You can now log in and start ordering fresh fruits.

Regards,
Fruit Delivery Team
`;

    const html = `
    <h2>Welcome ${userName}</h2>

    <p>Your account has been registered successfully.</p>

    <table border="1" cellpadding="8" cellspacing="0">
        <tr>
            <td><b>User ID</b></td>
            <td>${userId}</td>
        </tr>

        <tr>
            <td><b>Email</b></td>
            <td>${userEmail}</td>
        </tr>
    </table>

    <br>

    <p>You can now log in and start ordering fresh fruits from our platform.</p>

    <br>

    <p>Regards,<br><b>Fruit Delivery Team</b></p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
};