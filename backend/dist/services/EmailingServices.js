"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServices = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var ses = new aws_sdk_1.default.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
    },
});
var EmailServices = /** @class */ (function () {
    function EmailServices() {
    }
    EmailServices.sendEmail = function (options) {
        // SendGrid Transporter
        // const transporter = nodemailer.createTransport({
        //   service: process.env.EMAIL_SERVICE,
        //   auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD,
        //   },
        // });
        // AWS SES Transporter
        var transporterSES = nodemailer_1.default.createTransport({
            SES: { ses: ses, aws: aws_sdk_1.default },
        });
        var mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.text,
        };
        // transporter.sendMail(mailOptions, function (err, info) {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log(info);
        //   }
        // });
        transporterSES.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            console.log(info.envelope);
        });
    };
    return EmailServices;
}());
exports.EmailServices = EmailServices;
