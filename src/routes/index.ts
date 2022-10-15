import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/privacy', (req: Request, res: Response) => {
  res.render('privacy');
});

router.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.session_id);
  
  
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