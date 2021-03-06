/**
 * This controller is used in connection with everything that has to do with signup
 * including signing up, conforming the email and sending the mail again
 * also uses {@link EmailVerificationServices}
 */

import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';
import {Address} from "../models/address.model";
import {EmailVerificationServices} from '../services/emailServices/emailVerification.services'
import * as fs from 'fs';
import {UserBuilder} from "../models/userBuilder.model";
import {DbServices} from '../services/db.services';


var jwt = require('jsonwebtoken');
const router: Router = Router();

// keys for jwt token
const publicKey = fs.readFileSync('./app/services/public.key', 'utf8');
const dbService = new DbServices();


/**
 * reacts on HTTP Client POST /signup events by sending Mail to new user and adding the user to DB
 * returns 201 (created) if signup worked and 400 if email address is already taken
 * and 409 if there was a problem saving the user to the DB
 */
router.post('/', async (req: Request, res: Response) => {
  const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
  const user: User = UserBuilder.user()
    .setFirstname(req.body.firstname)
    .setLastname(req.body.lastname)
    .setEmail(req.body.email)
    .setPwhash(req.body.pwhash)
    .setIsVerified(false)
    .setAddress(address)
    .build();

  try {
    await dbService.signUp(user);
    EmailVerificationServices.sendMailToUser(user);
    res.statusCode = 201;
    res.json('sign up success');
  } catch (error) {
    console.log(error.message);
    if (error.errorCode == 926) {
      res.status(400).send(error.message);
    } else {
      res.status(409).send(error.message);
    }
  }
});


/**
 * Method used to verify jwt token
 * @param req from HTTP client
 * @param res answer to client that verifying token worked and therefore user is now verified
 * 401 if token is expired or 406 if the token is invalid
 */
const verifyToken = async (req: Request, res: Response) => {

  try {
    const tokenUrl = req.url;
    const token = tokenUrl.substring(tokenUrl.lastIndexOf('/') + 1);
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'
    };
    let decoded = jwt.verify(token, publicKey, verifyOptions);
    await dbService.makeUserVerified(decoded.email);
    res.status(200);
    res.json('Thank you for verifying your email-address you can now login.');
  } catch (error) {
    console.log(error);
    if (error.message == 'jwt expired') {
      res.status(401).send('Access token expired');
    } else {
      res.status(406);
      res.send('invalid Token' + error);
    }
  }
};

/**
 * HTTP listener calls verify Token if the user clicked on the link
 * in his email.
 */
router.get('/confirmation/:token', verifyToken);


/**
 * Reacts on sendMailAgain events using HTTP Client
 * will resend the email so user can verify and then login
 *
 */
router.post('/sendMailAgain', async (req: Request, res: Response) => {
    let email: string = req.body.email;

    try {
      const userWithoutMail = await dbService.getUserFromEmail(email);
      await EmailVerificationServices.sendMailToUser(userWithoutMail);
      res.status(200);
      res.json('The email was sent again please also check your spam folder. Thank you');
    } catch (error) {
      res.status(404);
      res.send(error + 'unknown email-address. Please check or sign up.');
      console.log(error);
    }

  }
);


export const SignupController: Router = router;
