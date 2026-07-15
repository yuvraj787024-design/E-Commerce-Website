const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendMail(options) {

    try {

        const mailOptions = {
            from: process.env.EMAIL,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        await transporter.sendMail(mailOptions);

        console.log("Email Sent Successfully");

    } catch (error) {

        console.log(error);

    }

}

module.exports = sendMail;