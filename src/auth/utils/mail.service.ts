import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/settings/settings";
import { injectable } from "inversify";

@injectable()
export class MailService {
  async sendMail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = this._getTransporter();

    const sendRes = await transporter.sendMail({
      from: "Hi <man>",
      to: email,
      subject: "Подтвердите регистрацию",
      html: template(code),
    });
    return Boolean(sendRes);
  }

  async sendRecoveryPassMail(
    email: string,
    code: string,
    template: (code: string) => string,
  ) {
    const transporter = this._getTransporter();

    const sendRes = await transporter.sendMail({
      from: "Hi <man>",
      to: email,
      subject: "Подтвердите изменение пароля",
      html: template(code),
    });
    return Boolean(sendRes);
  }

  _getTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });
  }
}
