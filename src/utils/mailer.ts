import nodemailer from "nodemailer";
import { renderCSV } from "./csvParser";
import { Console } from "console";

require("dotenv").config();

interface ICredential {
  host: string;
  user: string;
  pass: string;
  port: number;
}

const templateComplier = (obj: any, body: string, subject?: string) => {
  for (const key in obj) {
    if (
      typeof obj === "object" &&
      Object.prototype.hasOwnProperty.call(obj, key)
    ) {
      const regex = new RegExp(`{{${key}}}`, "g");
      body = body.replace(regex, obj[key]);
      subject ? (subject = subject.replace(regex, obj[key])) : undefined;
    }
  }

  const output = { body: body, subject: subject };

  return output;
};

const sendMail = async (
  to: string,
  subject: string,
  body: string,
  sender?: string,
  senderMail?: string,
  isHTML: boolean = false,
  credentials: ICredential = {
    host: process.env.CYPHEIR_MAIL_HOST || "",
    user: process.env.CYPHEIR_MAIL_USER || "",
    pass: process.env.CYPHEIR_MAIL_PASSWORD || "",
    port: 465,
  }
): Promise<void | string> => {
  const { host, user, pass, port } = credentials;

  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const senderDetail = sender ? sender : `Cypheir Mailer 🤖 <${user}>`;
  try {
    const data = await transporter.sendMail({
      sender: senderMail,
      from: senderDetail,
      to,
      subject,
      text: isHTML ? "" : body,
      html: isHTML ? body : "",
    });

    console.log("Message sent: %s", data.messageId);
    return data.messageId;
  } catch (error) {
    console.log(error);
  }
};

interface IOTP {
  receiver: string;
  otp: string | number;
  username?: string;
  brand?: string;
  support?: string;
}

const sendOTPMail = async (
  data: IOTP,
  credentials: ICredential = {
    host: process.env.CYPHEIR_MAIL_HOST || "",
    user: process.env.CYPHEIR_MAIL_USER || "",
    pass: process.env.CYPHEIR_MAIL_PASSWORD || "",
    port: 465,
  },
  callback: unknown
): Promise<void> => {
  const { receiver, otp, username, brand, support } = data;
  const { host, user, pass, port } = credentials;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    const hasBrandSubject = brand ? brand : "🤖";
    const hasUsername = username ? username : "User";

    const data = await transporter.sendMail({
      from: `Cypheir OTP Mail 🤖📧 <${user}>`,
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
  </style>
</head>
<body style="font-family: 'Poppins', sans-serif; font-size: 16px; line-height: 1.6; color: #222; margin: 0; padding: 0;">
<table style="padding: 20px;">
<p>Dear ${hasUsername},</p>

<p>Thank you for using our service. As part of our security measures, we require a <strong>One-Time Password (OTP)</strong> to proceed with your request. Your OTP is valid for <strong>5 minutes</strong> and is intended for a single use only.<p>

<p>Your OTP: <span style="font-weight: 600; font-size: 1.33rem; letter-spacing: 2px; color: #1ca7ec; font-variant-numeric: tabular-nums;">${otp}</span></p>

<p>Please enter this code on the verification page to continue. If you did not initiate this request, please ignore this email or contact us immediately at ${
        support ? support : process.env.CYPHEIR_MAIL_SUPPORT
      }.</p>
<b/>
<p>For your security, never share your OTP with anyone.</p>

<p>Best regards, The ${
        brand
          ? brand + " Team"
          : `<span style="font-weight: 500; color: #1ca7ec;">Cypheir</span> Team`
      }.</p>
</table>
</body>
</html>`,
    });

    if (data && typeof callback === "function") {
      console.log("Message sent: %s", data.messageId);
      callback();
    }
  } catch (error) {
    console.log(error);
  }
};

const sendBulkMail = async (
  to: string,
  subject: string,
  body: string,
  csv?: string | object,
  sender?: string,
  senderMail?: string,
  isHTML: boolean = false
) => {
  try {
    let mailContent: string | Array<string> = "" || [];
    let toAddress: string | Array<string> = "" || [];
    let mailSubject: string | Array<string> = "" || [];

    if (csv && typeof csv === "string") {
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
          csvObj[header[i]] = el[i];
          if (header[i] === "email" || header[i] === "work_email")
            typeof toAddress !== "string" ? toAddress.push(el[i]) : "";
        }
        return csvObj;
      });
      //  CSV Process completed

      //  Replace HTML or body content
      const templates = csvPack.map(
        (el): { tbody: string; tsubject: string } => {
          let bodyProcess = body;
          let subjectProcess = subject;

          const temp = templateComplier(el, bodyProcess, subjectProcess);

          return {
            tbody: temp.body,
            tsubject: temp.subject ? temp?.subject : subject,
          };
        }
      );

      mailContent = templates.map((el: { tbody: string; tsubject: string }) => {
        return el.tbody;
      });

      mailSubject = templates.map((el: { tbody: string; tsubject: string }) => {
        return el.tsubject;
      });

      const result: [] = [];

      for (let i = 0; i < toAddress.length; i++) {
        const data = sendMail(
          toAddress[i],
          mailSubject[i],
          mailContent[i],
          sender,
          senderMail,
          isHTML
        );
      }

      return result;
    } else if (csv && typeof csv === "object") {
      let bodyProcess = body;
      let subjectProcess = subject;

      const temp = templateComplier(csv, bodyProcess, subjectProcess);

      mailContent = temp.body;
      mailSubject = temp.subject ? temp.subject : subject;

      return sendMail(to, mailSubject, mailContent, sender, senderMail, isHTML);
    } else {
      //  Replace HTML or body content
      toAddress = to;
      mailContent = body;
      mailSubject = subject;

      return sendMail(
        toAddress,
        mailSubject,
        mailContent,
        sender,
        senderMail,
        isHTML
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export { sendMail, sendOTPMail, sendBulkMail };
