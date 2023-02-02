/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { ProfileModel } from '../models/profile';

import { Jwt } from '../models/jwt';

const profileModel = new ProfileModel();
const jwt = new Jwt();

const router: Router = Router();

router.get('/check', async (req: Request, res: Response) => {
  try {
    res.send({ ok: true });
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    let accessToken: any = req.query.accessToken;
    let rs: any = await profileModel.getProfile(accessToken);
    if (rs.cid) {
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