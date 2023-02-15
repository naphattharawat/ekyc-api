import { DeviceModel } from '../models/devices';
/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';


import { Jwt } from '../models/jwt';
import { WifiMophModel } from '../models/wifi-moph';

const wifiMophModel = new WifiMophModel
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const macAddress = req.body.macAddress;
    const deviceId = req.body.deviceId;
    const cid = req.decoded.cid;
    if (deviceId && macAddress) {
      const info = await wifiMophModel.findMacAddress(db, cid);
      if (info.length) {
        await wifiMophModel.removeMacAddress(db, cid);
      }
      for (const i of process.env.FIREWALL_IP.split(',')) {
        const obj = {
          'device_id': deviceId,
          'mac_address': macAddress,
          'firewall_url': `${i}`,
          cid: cid
        }
        await wifiMophModel.saveMacAddress(db, obj);
      }
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'Parameter not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    const deviceId = req.body.deviceId;
    if (deviceId) {
      await wifiMophModel.removeMacAddress(db, deviceId);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'Parameter not found' });
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});



export default router;