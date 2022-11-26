import { RegisterModel } from './../models/register';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();
const registerModel = new RegisterModel();
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/privacy', (req: Request, res: Response) => {
  res.render('privacy');
});

router.post('/ekyc', (req: Request, res: Response) => {
  const body = req.body;
  // {
  //   success: 'อนุมัติ',
  //   sessionId: '2c050c38-fef2-4ef6-b8fc-cf225776f23c',
  //   message: 'session 2c050c38-fef2-4ef6-b8fc-cf225776f23c ทำการยืนยันเสร็จสิ้น'
  // }
  if (body.sessionId) {
    registerModel.updateKYC(req.db, body.sessionId);
  }
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/testmq', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.session_id);


  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.post('/testmq', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.session_id);


  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});



export default router;