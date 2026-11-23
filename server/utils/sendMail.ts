import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
require("dotenv").config();

interface ISendEmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const sendEmail = async ({ email, subject, template, data }: ISendEmailOptions) => {
    try {
        const host = process.env.SMTP_HOST || process.env.SMPT_HOST || "smtp.gmail.com";
        const service = (process.env.SMTP_SERVICE || process.env.SMPT_SERVICE || "").trim().toLowerCase();
        const rawPort = process.env.SMTP_PORT || process.env.SMPT_PORT;
        const user = (process.env.SMTP_MAIL || process.env.SMPT_MAIL || process.env.SMTP_USER || process.env.SMPT_USER || "").trim();
        const rawPass = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD || "";
        // Clean Google App Password whitespace (Google displays 16-char codes like "stuv gzsf kgaf zxwx")
        const pass = rawPass.replace(/\s+/g, "");

        // Determine if target service is Gmail
        const isGmail = service === "gmail" || host.toLowerCase().includes("gmail");
        const port = Number(rawPort) || (isGmail ? 465 : 587);
        // Port 2525 is often accidentally copied from Mailtrap; Gmail does not support 2525
        const effectivePort = isGmail && port === 2525 ? 465 : port;
        const secure = effectivePort === 465;

        // Create transporter configuration
        const transporterConfig: any = isGmail
            ? {
                  service: "gmail",
                  host: "smtp.gmail.com",
                  port: effectivePort,
                  secure,
                  auth: {
                      user,
                      pass,
                  },
              }
            : {
                  host,
                  port: effectivePort,
                  secure,
                  auth: {
                      user,
                      pass,
                  },
              };

        const transporter: Transporter = nodemailer.createTransport(transporterConfig);

        // Render the email template using EJS
        const templateFile = template.endsWith(".ejs") ? template : `${template}.ejs`;
        const templatePath = fs.existsSync(path.join(__dirname, `../mails/${templateFile}`))
            ? path.join(__dirname, `../mails/${templateFile}`)
            : path.join(process.cwd(), `mails/${templateFile}`);
        const html = await ejs.renderFile(templatePath, data);

        const fromName = process.env.SMTP_FROM_NAME || "E-Learning";
        const fromAddress = user || "no-reply@example.com";
        const from = `"${fromName}" <${fromAddress}>`;

        // Send the email
        const mailOptions = {
            from,
            to: email,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error: any) {
        console.error(`[sendMail] Failed to send email to ${email}:`, error?.message || error);
        throw new Error(`Email could not be sent to ${email}: ${error?.message || error}`);
    }
};

export default sendEmail;
 