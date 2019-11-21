

import {Request, Response} from "express";



export function createCheckoutSession(req: Request, res: Response) {

  const courseId = req.body.courseId;

  console.log("Purchasing course with id: ", courseId);



  res.status(200).json({});
}
