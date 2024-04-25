import nodemailer from "nodemailer";
import { renderCSV } from "./csvParser";
import { Console } from "console";

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.CYPHEIR_MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.CYPHEIR_MAIL_USER,
    pass: process.env.CYPHEIR_MAIL_PASSWORD,
  },
});

const sendMail = async (
  to: string,
  subject: string,
  body: string,
  isHTML: boolean = false
): Promise<void> => {
  const mailHost = process.env.CYPHEIR_MAIL_USER;
  try {
    const data = await transporter.sendMail({
      from: `Cypheir Mailer 🤖 <${mailHost}>`,
      to,
      subject,
      text: isHTML ? "" : body,
      html: isHTML ? body : "",
    });

    console.log("Message sent: %s", data.messageId);
  } catch (error) {
    console.log(error);
  }
};

const sendOTPMail = async (
  receiver: string,
  otp: string | number,
  username?: string,
  brand?: string,
  support?: string,
  host?: string
): Promise<void> => {
  const otpHost = host || process.env.CYPHEIR_MAIL_USER;
  const hasBrandSubject = brand ? brand : "🤖";
  const hasUsername = username ? username : "User";

  try {
    const data = await transporter.sendMail({
      from: `Cypheir OTP Mail 🤖📧 <${otpHost}>`,
      to: receiver,
      subject: `${hasBrandSubject} Immediate Action Needed: Your OTP Code (${otp})`,

      html: `
      <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      padding: 20px;
    }
    .otp-code {
      font-weight: 600;
      font-size: 1.33rem;
      letter-spacing: 2px
      color: #1ca7ec;
      font-variant-numeric: tabular-nums;
    }
    .brand-name {
      font-weight: 500;
      color: #1ca7ec;
    }
  </style>
</head>
<body>
<p>Dear ${hasUsername},</p>

<p>Thank you for using our service. As part of our security measures, we require a <strong>One-Time Password (OTP)</strong> to proceed with your request. Your OTP is valid for <strong>5 minutes</strong> and is intended for a single use only.<p>

<p>Your OTP: <span class="otp-code">${otp}</span></p>

<p>Please enter this code on the verification page to continue. If you did not initiate this request, please ignore this email or contact us immediately at ${
        support ? support : process.env.CYPHEIR_MAIL_SUPPORT
      }.</p>
<b/>
<p>For your security, never share your OTP with anyone.</p>

<p>Best regards, The ${
        brand ? brand + " Team" : `<span class="brand-name">Cypheir</span> Team`
      }.</p>

</body>
</html>`,
    });

    console.log("Message sent: %s", data.messageId);
  } catch (error) {
    console.log(error);
  }
};

const sendBulkMail = async (
  to: string,
  subject: string,
  body: string,
  csv: string,
  isHTML: boolean = false
): Promise<void> => {
  try {
    //  Start CSV Processing
    const itemArr: [][] = await renderCSV(csv);
    const header = itemArr[0]?.map((el: string) => {
      return el.toLowerCase().replace(/ /g, "_");
    });
    const content = itemArr.slice(1);

    //  Converts CSV arrays into objects
    const csvPack = content.map((el) => {
      const csvObj: any = {};
      for (let i = 0; i < header.length; i++) {
        csvObj[`${header[i]}`] = el[i];
      }
      return csvObj;
    });
    //  CSV Process completed

    //  Replace HTML or body content
    const allBody = csvPack.map((el) => {
      const bodyProcess = body;

      for (const key in el) {
        if (Object.prototype.hasOwnProperty.call(el, key)) {
          const regex = new RegExp(`{{${key}}}`, "g");
          console.log(bodyProcess.replace(regex, `${el[key]}`));
          bodyProcess.replace(regex, `${el[key]}`);
        }
      }

      return bodyProcess;
    });

    console.log(allBody);
  } catch (error) {
    console.error(error);
  }

  //  Sending the message
  // const mailHost = process.env.CYPHEIR_MAIL_USER;
  // try {
  //   const data = await transporter.sendMail({
  //     from: `Cypheir Mailer 🤖 <${mailHost}>`,
  //     to,
  //     subject,
  //     text: isHTML ? "" : body,
  //     html: isHTML ? body : "",
  //   });

  //   console.log("Message sent: %s", data.messageId);
  // } catch (error) {
  //   console.log(error);
  // }
};

sendBulkMail(
  "",
  "",
  "I love to work in {{work_city}}, {{work_country}}",
  "./test/example_people.csv"
);

export { sendMail, sendOTPMail };
