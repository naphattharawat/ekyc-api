import { RegisterModel } from '../models/register';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
var routeCache = require('route-cache');
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import e = require('express');
var generator = require('generate-password');


const jwt = new Jwt();
const registerModel = new RegisterModel();
const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const rs: any = await registerModel.login(username, password);
  if (rs.statusCode == 200) {
    const profile = await registerModel.getProfile(rs.body.access_token);
    if (profile.statusCode == 200) {
      if (profile.body.is_kyc == 'Y') {
        const data = {
          cid: profile.body.cid,
          is_kyc: profile.body.cid
        }
        const token = await jwt.sign(data);
        res.send({ token: token });
      }else{
        res.status(401);
        res.send();
      }
    }else{
      res.status(profile.statusCode);
      res.send(profile.body);
    }
  }else{
    res.status(rs.statusCode);
    res.send(rs.body);
  }
});




export default router;