import {Request, Response, Router} from "express";
import {Address} from "../models/address.model";
import {EventService} from "../models/eventService.model";
import {EventServiceBuilder} from "../models/eventServiceBuilder.model";
import {DbServices} from "../services/db.services";

const router: Router = Router(); // part of express needed
const dbService = new DbServices();

/**
 * creates an Address and an EventService from the giben requestbody and adds it to the database
 */
router.post('/add', async(req: Request, res: Response) => {

    const address = new Address(req.body.street, req.body.housenumber, req.body.zip, req.body.city);
    const eventService: EventService = EventServiceBuilder.eventService()
      .setProviderId(req.body.providerId)
      .setCategory(req.body.category)
      .setTitle( req.body.title)
      .setDescription(req.body.description)
      .setAvailability(req.body.availability)
      .setAddress(address)
      .setPerimeter(req.body.perimeter)
      .build();
    if(req.body.subtype!=null){
      eventService.setSubtype(req.body.subtype);
    }
    try {
      dbService.addEventService(eventService);
      res.statusCode = 200;
      res.send('Service was created and saved')
    }
    catch (error) { //TODO welche error können auftreten?
      res.send(error);
      res.statusCode= 400;


    }
  }
)



router.get('/update', async (req:Request, res: Response)=>{
  // woher wissen welchen Service es betrifft


})



export const EventserviceController: Router = router;