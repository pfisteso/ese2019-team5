// this is a test file to test the database connection and the functions of db.service.ts while developing

import {Request, Response, Router} from 'express';
import {SqlResult} from '../models/sqlresult.model';
import {DbServices} from '../services/db.services';
import {User} from '../models/user.model';
import {FileHandlerService} from "../services/fileHandler.service";
import {EventServiceFilter} from "../models/eventServiceFilter.model";
import {FilterCategories} from "../models/filterCategories.enum";
import {UserBuilder} from "../models/userBuilder.model";
import {Address} from "../models/address.model";


const router: Router = Router();
const dbService = new DbServices();
router.get('/', async (req: Request, res: Response) => {

  res.statusCode = 200;
  res.send('Welcome to SQLTest');
});

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  let sql: SqlResult;
  try {
    sql = await dbService.getSqlResult(name);
    res.statusCode = 200;
    res.send('Welcome to Express ' + sql.user[0].toNameString());
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.send('no user with lastname ' + name + ' found in database');
  }
});

router.get('/getUserFromMail/:mail', async (req: Request, res: Response) => {
  const mail = req.params.mail;
  let user: User;
  try {
    user = await dbService.getUserFromEmail(mail);
    res.statusCode = 200;
    res.send(user.toNameString());
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

router.get("/testID/:z", async(req: Request, res: Response) => {
  const fileHander = new FileHandlerService();
  fileHander.test(4);
  res.statusCode = 200;
  res.send("abc");
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

router.get("/testImage/:id", async(req: Request, res: Response) => {
  const handler = new FileHandlerService();

  res.statusCode = 200;
  res.send(handler.test(100));
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


export const SqlTestController: Router = router;
