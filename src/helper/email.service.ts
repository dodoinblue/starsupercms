import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { EMAIL } from '../config/configurations';

export interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer;
  private clientIsValid: boolean;

  constructor() {
    this.transporter = nodemailer.createTransport(EMAIL.nodemailer);
    this.verifyClient();
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false;
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
        console.warn(
          'Email client not initialized. Will retry after 30 min.',
          error,
        );
      } else {
        this.clientIsValid = true;
        console.info('Email client initialized.');
      }
    });
  }

  public sendMail(mailOptions: IEmailOptions) {
    if (!this.clientIsValid) {
      console.warn('Email client not initialized. Email not sent.');
      return false;
    }
    const options = Object.assign(mailOptions, { from: EMAIL.sender });
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        console.warn('Email not sent!', error);
      } else {
        console.info('Email sent', info.messageId, info.response);
      }
    });
  }
}
