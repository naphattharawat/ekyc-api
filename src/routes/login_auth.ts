/// <reference path="../../typings.d.ts" />

import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { DeviceModel } from '../models/devices';

import { LoginModel } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new LoginModel();
const jwt = new Jwt();
const deviceModel = new DeviceModel();
const router: Router = Router();


router.post('/', async (req: Request, res: Response) => {
  try {
    let deviceId: string = req.body.deviceId;
    let cid: string = req.body.cid;
    let fcmToken: string = req.body.fcmToken;
    const data: any = {};
    if (deviceId && cid) {
      const obj: any = {
        device_id: deviceId,
        cid: cid,
        fcm_token: fcmToken
      }
      await deviceModel.saveDeviceBio(req.db, obj);
      await loginModel.saveLog(req.db, deviceId, 'SHORT_LOGIN');
      let token: any = {
        device_id: deviceId,
        cid: cid
      };
      data.token = jwt.sign(token);
      data.ok = true;
      res.send(data);
    } else {
      res.status(401)
      res.send({ ok: false, error: 'ไม่พบ deviceId และ cid' });
    }
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.post('/v2', async (req: Request, res: Response) => {
  try {
    let deviceInfo: any = req.body.deviceInfo;
    let cid: string = req.body.cid;
    const data: any = {};
    if (deviceInfo.deviceId && cid) {
      const obj: any = {
        device_id: deviceInfo.deviceId,
        cid: cid,
        fcm_token: deviceInfo.fcmToken,
        os: deviceInfo.os,
        version: deviceInfo.version,
        phone_name: deviceInfo.phoneName,
        sdk: deviceInfo.sdk,
        model: deviceInfo.model,
        model_marketing: deviceInfo.modelMarketing,
        brand: deviceInfo.brand
      }
      // await deviceModel.saveDeviceBio(req.db, obj);
      try {
        await deviceModel.saveDeviceV2(req.db, obj);
      } catch (error) {
        console.log('catch', error);
      }
      await loginModel.saveLog(req.db, deviceInfo.deviceId, 'SHORT_LOGIN');
      let token: any = {
        device_id: deviceInfo.deviceId,
        cid: cid
      };
      data.token = jwt.sign(token);
      data.ok = true;
      res.send(data);
    } else {
      res.status(401)
      res.send({ ok: false, error: 'ไม่พบ deviceId และ cid' });
    }
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.get('/app', async (req: Request, res: Response) => {
  try {
    let appId: any = req.query.appId;
    if (appId) {
      const rs: any = await loginModel.getApp(req.db, appId);
      res.send({ ok: true, rows: rs });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

export default router;