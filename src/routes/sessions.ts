/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { SessionsModel } from '../models/sessions';

import { Jwt } from '../models/jwt';

const sessionsModel = new SessionsModel();
const jwt = new Jwt();

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const cid = req.decoded.cid;
    const rs: any = await sessionsModel.getSession(req.db, cid)
    res.send({ ok: true });
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});


export default router;