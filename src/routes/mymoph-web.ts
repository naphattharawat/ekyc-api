/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as multer from 'multer';
import * as express from 'express';
import { Router, Request, Response } from 'express';
var routeCache = require('route-cache');

import { MyMophWebModel } from '../models/mymoph-web';

const myMophWebModel = new MyMophWebModel();
const router: Router = Router();


router.get('/advertise/all', async (req: Request, res: Response) => {
  try {
    const rs: any = await myMophWebModel.getAllAdvertise();
    res.send({ ok: true, rows: rs.body });
  } catch (error) {
    res.send({ ok: false, rows: [] });
  }
});
router.get('/advertise/image/:imagename', async (req: Request, res: Response) => {
  try {
    const name = req.params['imagename'];
    const rs: any = await myMophWebModel.getAdvertiseImage(name);
    res.send({ ok: true, rows: rs.body });
  } catch (error) {
    res.send({ ok: false, rows: [] });
  }
});
router.get('/db/advertise/all', async (req: Request, res: Response) => {
  try {
    const rs: any = await myMophWebModel.getAdvertiseList(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, rows: [] });
  }
});
router.get('/db/advertise/by_id/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'];
    const rs: any = await myMophWebModel.getAdvertiseById(req.db,id);
    res.send({ ok: true, rows: rs[0] });
  } catch (error) {
    res.send({ ok: false, rows: [] });
  }
});


export default router;