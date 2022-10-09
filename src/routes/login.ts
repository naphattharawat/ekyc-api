/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { LoginModel } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new LoginModel();
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    let username: string = req.body.username;
    let password: string = req.body.password;
    let rs: any = await loginModel.login(username, password);
    console.log(rs);

    if (rs.access_token) {
      res.send(rs);
    } else {
      res.status(401)
      res.send({ ok: false, error: rs.error, message: rs.message });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

// mymoph://qr?clientId=xxxxx&token=xxxxx&sessionId=xxx
router.post('/qr', async (req: Request, res: Response) => {
  try {
    let clientId: string = req.body.clientId;
    let refreshToken: string = req.body.refreshToken;
    let accessToken: string = req.body.accessToken;
    let sessionId: string = req.body.sessionId;
    console.log(req.body);
    
    let rs: any = await loginModel.loginQR(clientId, sessionId, refreshToken, accessToken);
    console.log(rs);
    if (rs) {
      if(rs.message == "OK"){
        rs.ok = true;
        res.send(rs);
      }else{
        rs.ok = false;
        res.send(rs);
      }
    } else {
      res.status(401)
      res.send({ ok: false, error: rs.error, message: rs.message });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.post('/token', async (req: Request, res: Response) => {
  try {
    let refreshToken: string = req.body.refreshToken;
    let rs: any = await loginModel.refreshToken(refreshToken);

    if (rs.access_token) {
      rs.ok = true;
      res.send(rs);
    } else {
      res.status(401)
      res.send({ ok: false, error: rs.error, message: rs.message });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

export default router;