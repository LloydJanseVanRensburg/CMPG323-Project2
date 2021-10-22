import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

export class EmailServices {
  static sendEmail(options: SendEmailOptions) {
    console.log('seding...1');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      console.log('sending...2');
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}
