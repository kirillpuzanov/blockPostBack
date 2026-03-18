import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/settings/settings";

export const mailService = {
  async sendMail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    const sendRes = await transporter.sendMail({
      from: "Hi <man>",
      to: email,
      subject: "Подтвердите регистрацию",
      html: template(code),
    });
    return Boolean(sendRes);
  },
};
