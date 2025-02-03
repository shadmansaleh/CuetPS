import { Router, Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, message } = req.body;
  
      if (!name || !email || !message) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      next(error);
    }
  });
  

export default router;
