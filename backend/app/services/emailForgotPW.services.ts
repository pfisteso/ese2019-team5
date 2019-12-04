import * as fs from 'fs';
import {User} from '../models/user.model';
import * as jwt from 'jsonwebtoken';

import {EmailForgotPWCreatorService} from "./emailForgotPWCreator.service";
import {EmailService} from "./Email.service";

const privateKey = fs.readFileSync('./app/services/privateForgotPWKey.key', 'utf8');
const emailService = new EmailForgotPWCreatorService();
let token: string;

/**
 * creates a jwt token for the email using payload and email
 * @param payload that will be part of the jwt token
 * @param email needed vor subject and audience
 * @return emailURL that will be sent to user by sendMailToNewUser Method
 * is called from sendMailToNewUser
/* *!/
function makeToken(payload: any, email: string): string {
  var signOptions = {
    issuer: 'Eventdoo',
    subject: email,
    audience: email,
    expiresIn: '24h',
    algorithm: 'RS256'
  };
  var emailToken = jwt.sign(payload, privateKey, signOptions);
  const emailUrl = `http://localhost:4200/start/login/resetPassword/${emailToken}`;
  token = emailToken;
  return emailUrl;
}*/

/**
 * creates an jwt token that is is part of url which is send to user by using {nodemailer}
 * User needs to verify email by clicking on URL to login
 */

export class EmailForgotPWServices extends EmailService {


  public static async sendMailToUser(user: User) {
    super.sendMailToUser(user);
  }


// send mail with defined transport object

  static getMailOptions(email: string, emailURL: string): any {
    console.log('got to mail Options');
    var mailOptions = {
      from: '"Eventdoo" <ESEteam5@gmx.de>',
      to: email,
      subject: 'Password Reset',
      html: EmailForgotPWCreatorService.getEmailForgotPWText(emailURL)
    };
    return mailOptions;
  }

  static makeToken(payload: any, email: string): string {
    var signOptions = {
      issuer: 'Eventdoo',
      subject: email,
      audience: email,
      expiresIn: '24h',
      algorithm: 'RS256'
    };
  //  const privateKey = fs.readFileSync('./app/services/privateForgotPWKey.key', 'utf8');
    var emailToken = jwt.sign(payload, privateKey, signOptions);
    const emailUrl = `http://localhost:4200/start/login/resetPassword/${emailToken}`;
    return emailUrl;
  }

  /*transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent' + info.response);
    }
  });

}catch (e) {
  console.log(e);
}
}*/

}













