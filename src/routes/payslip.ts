import { PaySlipModel } from './../models/payslip';
/// <reference path="../../typings.d.ts" />
import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';



const paySlipModel = new PaySlipModel();


const router: Router = Router();

router.get('/slip', async (req: Request, res: Response) => {
  try {
    const accessToken = req.query.accessToken;
    const rs: any = await paySlipModel.getSlip(accessToken);
    res.send(rs);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.get('/slips', async (req: Request, res: Response) => {
  try {
    const accessToken = req.query.accessToken;
    const rs: any = await paySlipModel.getSlips(accessToken);
    res.send(rs);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});


export default router;