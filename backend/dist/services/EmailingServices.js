"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServices = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
// FIXME:
// Awaiting for AWS to remove SES account from sandbox then able to test
/* const ses = new aws.SES({
   apiVersion: '2010-12-01',
   region: process.env.AWS_REGION!,
   credentials: {
     accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
     secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
   },
 });
 */
var EmailServices = /** @class */ (function () {
    function EmailServices() {
    }
    EmailServices.sendEmail = function (options) {
        // SendGrid Transporter
        var transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        // FIXME:
        // AWS SES Transporter
        // Awaiting for AWS to remove SES account from sandbox then able to test
        /*
        const transporterSES = nodemailer.createTransport({
          SES: { ses, aws },
        });
        */
        var mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.text,
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        });
        // FIXME:
        // Awaiting for AWS to remove SES account from sandbox then able to test
        /* transporterSES.sendMail(mailOptions, (err, info) => {
          if (err) console.log(err);
    
          console.log(info.envelope);
        }); */
    };
    return EmailServices;
}());
exports.EmailServices = EmailServices;
