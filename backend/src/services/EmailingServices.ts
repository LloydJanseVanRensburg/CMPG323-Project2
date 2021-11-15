import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY!,
  },
});

export class EmailServices {
  static sendEmail(options: SendEmailOptions) {
    // AWS SES Transporter
    const transporterSES = nodemailer.createTransport({
      SES: { ses, aws },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    transporterSES.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);

      console.log(info.envelope);
    });
  }
}
