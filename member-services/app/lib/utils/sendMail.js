const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const sendMail = async ({ to, subject, action_url }) => {
    try {
        // 1. Read and compile the template
        const htmlFilePath = path.join(__dirname, '../../templates/forgot-password.html');
        const source = fs.readFileSync(htmlFilePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        // 2. Prepare replacements
        const replacements = {
            title: subject,
            name: to,
            action_url: action_url,
            action_text: "Reset your password",
            operating_system: "Windows",
            browser: "Chrome",
            browser_name: "Chrome",
            platform: "Platform",
            support_url: "support_url",
            company_name: "Company Name",
            company_url: "company_url",
            company_address: "company_address",
            company_phone: "company_phone",
            company_email: "company_email",
            company_logo: "company_logo",
        };

        // 3. Generate HTML
        const htmlToSend = template(replacements);
        // 4. Configure transporter
        const mailConfig = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_USE_SSL === 'true',
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD
            }
        };

        const transporter = nodemailer.createTransport(smtpTransport(mailConfig));

        // 5. Prepare mail options
        const mailOptions = {
            from: process.env.EMAIL_HOST_USER,
            to,
            subject,
            html: htmlToSend
        };

        // 6. Send mail
        const info = await transporter.sendMail(mailOptions);

        return {
            status: true,
            message: 'Password reset link sent successfully',
            info: info.response
        };

    } catch (error) {
        return {
            status: false,
            message: 'Email could not be sent',
            error: error
        };
    }
};

module.exports = sendMail;
