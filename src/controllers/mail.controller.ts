import { sendMail, sendBulkMail } from "../utils/mailer";

const sendMailController = async (req: any, res: any) => {
  const { to, subject, body, sender, senderMail, isHTML } = req.body;


  console.log(to, subject, body, sender, senderMail, isHTML);

  const result = await sendMail(to, subject, body, sender, senderMail, isHTML);

  if (result) {
    return res.status(200).send(`Message sent: ${result}`);
  }

  return res.status(400).send("Message not sent.");
};

const sendBulkMailController = async (req: any, res: any) => {
  const { to, subject, body, csv, sender, senderMail, isHTML } = req.body;

  const result = await sendBulkMail(
    to,
    subject,
    body,
    csv,
    sender,
    senderMail,
    isHTML
  );

  if (result) {
    return res.status(200).send(`Message sent: ${result}`);
  }

  return res.status(400).send("Message not sent.");
};

export { sendMailController, sendBulkMailController };
