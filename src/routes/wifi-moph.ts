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
    if (deviceId && macAddress) {
      const info = wifiMophModel.findMacAddress(db, deviceId);
      if (info.length) {
        await wifiMophModel.removeMacAddress(db, deviceId);
      }
      for (const i of process.env.FIREWALL_URL.split(',')) {
        const obj = {
          'device_id': deviceId,
          'mac_address': macAddress,
          'firewall_url': `${i}/api/v2/cmdb/firewall/address`,
          cid: req.decoded.cid
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