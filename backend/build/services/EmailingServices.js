"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServices = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ses = new aws_sdk_1.default.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
    },
});
class EmailServices {
    static sendEmail(options) {
        // AWS SES Transporter
        const transporterSES = nodemailer_1.default.createTransport({
            SES: { ses, aws: aws_sdk_1.default },
        });
        const mailOptions = {
            from: process.env.AWS_EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.text,
        };
        transporterSES.sendMail(mailOptions, (err, info) => {
            if (err)
                console.log(err);
            console.log(info.envelope);
        });
    }
}
exports.EmailServices = EmailServices;
