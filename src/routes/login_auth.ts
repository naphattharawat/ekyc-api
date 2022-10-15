import { DeviceModel } from '../models/devices';
/// <reference path="../../typings.d.ts" />

import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import { LoginModel } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new LoginModel();
const jwt = new Jwt();

const router: Router = Router();


router.post('/', async (req: Request, res: Response) => {
  try {
    let deviceId: string = req.body.deviceId;
    let cid: string = req.body.cid;
    const data: any = {};
    if (deviceId && cid) {
      await loginModel.saveLog(req.db, deviceId, 'SHORT_LOGIN');
      let token: any = {
        device_id: deviceId,
        cid: cid
      };
      delete token.cid;
      data.token = jwt.sign(token);
      data.ok = true;
      res.send(data);
    } else {
      res.status(401)
      res.send({ ok: false, error: 'ไม่พบ deviceId และ cid' });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

export default router;