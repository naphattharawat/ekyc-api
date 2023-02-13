import { DeviceModel } from '../models/devices';
/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { LoginModel } from '../models/login';

import { Jwt } from '../models/jwt';

const deviceModel = new DeviceModel();
const loginModel = new LoginModel();
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
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