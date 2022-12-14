import { DeviceModel } from '../models/devices';
/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { LogoutModel } from '../models/logout';

import { Jwt } from '../models/jwt';

const deviceModel = new DeviceModel();
const logoutModel = new LogoutModel();
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    let deviceId: string = req.decoded.device_id;
    let rs: any = await logoutModel.setStatus(req.db, deviceId, 'OFFLINE');
    let rsL: any = await logoutModel.saveLog(req.db, deviceId, 'LOGOUT');
    if (rs && rsL) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'ออกจากระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' })
    }
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});


export default router;