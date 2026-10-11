import nodemailer,{Transporter} from "nodemailer";
import ejs from "ejs";
import path from "path";

interface ISendEmailOptions {
    email: string;
    subject: string;
    template: string;
    data:{[key: string]: any};
}

const sendEmail = async ({ email, subject, template, data }: ISendEmailOptions) => {
    try {
        // Create a transporter using your email service credentials
        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            service: process.env.SMTP_SERVICE, 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Render the email template using EJS
        const templateFile = template.endsWith('.ejs') ? template : `${template}.ejs`;
        const html = await ejs.renderFile(path.join(__dirname, `../mails/${templateFile}`), data);

        // Send the email
        await transporter.sendMail({
            from: process.env.SMTP_FROM_NAME,
            to: email,
            subject,
            html,
        });
    } catch (error) {
        throw new Error(`Email could not be sent to ${email}`);
    }
};

export default sendEmail; 