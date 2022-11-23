import { HrModel } from './../models/hr';
import { PaySlipModel } from '../models/payslip';
/// <reference path="../../typings.d.ts" />
import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';



const hrModel = new HrModel();


const router: Router = Router();
let accessToken: any = null;
let refreshToken: any = null;

router.get('/', async (req: Request, res: Response) => {
  try {
    const decoded = req.decoded;
    console.log(decoded);

    if (decoded.cid) {
      const c: any = await hrModel.checkToken(accessToken, refreshToken);
      if (c.ok) {
        accessToken = c.access_token;
        refreshToken = c.refresh_token;
        const rs: any = await hrModel.getData(decoded.cid, accessToken);
        if (rs.data) {
          res.send(rs);
        } else {
          res.send({ ok: false, error: 'ไม่พบข้อมูล' })
        }
      } else {
        res.send({ ok: false, error: 'ไม่พบข้อมูล' })
      }
    } else {
      res.send({ ok: false, error: 'ไม่พบเลขบัตรประชาชน' })
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});



export default router;