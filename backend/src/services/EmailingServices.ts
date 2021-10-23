import nodemailer from 'nodemailer';
// import aws from 'aws-sdk';

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

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

export class EmailServices {
  static sendEmail(options: SendEmailOptions) {
    // SendGrid Transporter
    const transporter = nodemailer.createTransport({
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

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    // FIXME:
    // Awaiting for AWS to remove SES account from sandbox then able to test

    /* transporterSES.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);

      console.log(info.envelope);
    }); */
  }
}
