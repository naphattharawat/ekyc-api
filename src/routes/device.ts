/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { DeviceModel } from '../models/devices';

import { Jwt } from '../models/jwt';

const deviceModel = new DeviceModel();
const jwt = new Jwt();

const router: Router = Router();

router.post('/v2', async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (body.deviceId) {
      const obj: any = {
        device_id: body.deviceId,
        cid: body.cid,
        fcm_token: body.fcmToken,
        os: body.os,
        version: body.version,
        phone_name: body.phoneName,
        sdk: body.sdk,
        model: body.model,
        model_version: body.modelVersion,
        brand: body.brand
      }
      await deviceModel.saveDeviceV2(req.db, obj);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'no deviceId' });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (body.deviceId) {
      const obj: any = {
        device_id: body.deviceId,
        cid: body.cid,
        fcm_token: body.fcmToken,
        system_name: body.systemName,
        version: body.version,
        model: body.model,
        model_version: body.modelVersion
      }
      await deviceModel.saveDevice(req.db, obj);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'no deviceId' });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});


export default router;