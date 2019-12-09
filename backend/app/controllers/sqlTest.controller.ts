/**
 * This controller is used for manually testing specific methods of the dbServices in an controlled environment.
 * It doesn't contribute to the functionality of the app at all, therefore it also doesn't contain any further comments
 *
 * @author Cyrill Rohrbach
 */

import {Request, Response, Router} from 'express';
import {DbServices} from '../services/db.services';
import {User} from '../models/user.model';
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";
import * as fs from "fs";


const router: Router = Router();
const dbService = new DbServices();
router.get('/', async (req: Request, res: Response) => {

  res.statusCode = 200;
  res.send('Welcome to SQLTest');
});

router.get('/getUserFromMail/:mail', async (req: Request, res: Response) => {
  const mail = req.params.mail;
  let user: User;
  try {
    user = await dbService.getUserFromEmail(mail);
    res.statusCode = 200;
    res.send(user);
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.send(e);
  }
});

router.get('/getUserFromId/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  let user: User;
  try {
    user = await dbService.getUserFromId(Number(id));
    res.statusCode = 200;
    res.send(user.getFirstname() + user.getLastname());
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.send(e);
  }
});

router.get('/tryMakeUserVerified/:z', async(req: Request, res: Response) => {

  try {
    await dbService.makeUserVerified('rohrbach.cyrill@bluewin.ch');
    res.statusCode = 200;
    res.send('ok');
  }catch (e) {
    console.log(e);
    res.statusCode = 200;
    res.send(e.msg);
  }
});

router.get("/tryService/:z", async(req: Request, res: Response) => {
  const services = await dbService.getAllServices();
  console.log(services);
  res.statusCode = 200;
  res.send(services);
});

router.get("/testFilter/:z", async(req: Request, res: Response) => {
  const id: number = 88;
  const filters = [new EventServiceFilter(FilterCategories.availability,"Friday")];

  const filters2: EventServiceFilter[] = [];
  const services = await dbService.getServiceFilter(filters);
  res.statusCode = 200;
  res.send(services);
});

router.get("/testUpdateUser/:z", async(req: Request, res: Response) => {
  const address = new Address("Ischlag", 64, 3303, "Jegenstorf");

  const user = new UserBuilder()
    .setId(88)
    .setFirstname("Cyrill J")
    .setLastname("Rohrbach")
    .setAddress(address)
    .setIsFirm(false)
    .setPhonenumber("+41 79 955 00 92")
    .build();

  // console.log(user);

  dbService.updateUser(user);

  res.statusCode = 200;
  res.send(await dbService.getUserFromId(88));
});

router.get("/testDelete/:z", async(req: Request, res: Response) => {
  dbService.deleteUser(102);
  res.statusCode = 200;
  res.send("Hello");
});

router.get("/testDeleteService/:z", async(req: Request, res: Response) => {
  dbService.deleteService(31);
  res.statusCode = 200;
  res.send("Hello");
});

router.get("/testResetPW/:z", async(req: Request, res: Response) => {
  dbService.resetPassword("test.test@test.ch",req.params.z);
  res.statusCode = 200;
  res.send("Hello");
});

router.get("/getServiceFromId/:id", async(req: Request, res: Response) => {
  res.statusCode = 200;
  res.send(await dbService.getServiceFromId(Number(req.params.id)));
});


router.get("/addFavorite/:id", async(req: Request, res: Response) => {
  try {
    await dbService.addFavoriteToUser(116,Number(req.params.id));
    res.statusCode = 200;
    res.send("added");
  } catch (e) {
    console.log(e);
    res.statusCode = 400;
    res.send("failed");
  }

});

router.get("/getFavorite/:id", async(req: Request, res: Response) => {
  try {
    const services = await dbService.getFavoritesFromUid(Number(req.params.id));
    res.statusCode = 200;
    res.send(services);
  } catch (e) {
    console.log(e);
    res.statusCode = 400;
    res.send("failed");
  }

});

router.get("/tryLogin/:id", async(req: Request, res: Response) => {
  try {
    const result = await dbService.tryLogin("testkonto1264@hotmail.com","1216985755");
    res.statusCode = 200;
    res.send(result.user);
  } catch (e) {
    console.log(e);
    res.statusCode = 400;
    res.send("failed");
  }

});


router.get("/tryGetImageType/:id", async(req: Request, res: Response) => {
  const b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlUAAAGcC";
  const type = b64.split(";")[0].split("/")[1];

  console.log(type);

  const file = fs.readFileSync ("../pictures/services/63/63.png", 'base64');
  console.log(Buffer.from(file).toString('base64'));

  res.statusCode = 200;
  res.send(type);
});

router.get("/isFavorite/:id", async(req: Request, res: Response) => {
  const result = await dbService.isServiceFavorite(1,5);

  console.log(result);

  res.statusCode = 200;
  res.send(result);
});



export const SqlTestController: Router = router;
