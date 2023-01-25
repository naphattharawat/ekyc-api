import { PaySlipModel } from './../models/payslip';
/// <reference path="../../typings.d.ts" />
import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import * as _ from 'lodash';


const paySlipModel = new PaySlipModel();


const router: Router = Router();

router.get('/slip', async (req: Request, res: Response) => {
  try {
    const accessToken = req.query.accessToken;
    const yy = req.query.yy;
    const mm = req.query.mm;
    const rs: any = await paySlipModel.getSlip(accessToken, yy, mm);
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

router.get('/v2/slip', async (req: Request, res: Response) => {
  try {
    const cid = req.decoded.cid;
    const yy = req.query.yy;
    const mm = req.query.mm;
    const rs: any = await paySlipModel.getDBSlipMonth(req.db, cid, yy, mm);
    const response = {
      success: true,
      data: {
        "nno": rs[0].nno ? rs[0].nno.toString() : '',
        "yy": rs[0].yy ? rs[0].yy.toString() : '',
        "mm": rs[0].mm ? rs[0].mm.toString() : '',
        "idno": rs[0].idno ? rs[0].idno.toString() : '',
        "nobank": rs[0].nobank ? rs[0].nobank.toString() : '',
        "money1": rs[0].money1 ? rs[0].money1.toString() : '',
        "money2": rs[0].money2 ? rs[0].money2.toString() : '',
        "money3": rs[0].money3 ? rs[0].money3.toString() : '',
        "money4": rs[0].money4 ? rs[0].money4.toString() : '',
        "money5": rs[0].money5 ? rs[0].money5.toString() : '',
        "money6": rs[0].money6 ? rs[0].money6.toString() : '',
        "money7": rs[0].money7 ? rs[0].money7.toString() : '',
        "money8": rs[0].money8 ? rs[0].money8.toString() : '',
        "money9": rs[0].money9 ? rs[0].money9.toString() : '',
        "money10": rs[0].money10 ? rs[0].money10.toString() : '',
        "sumget": rs[0].sumget ? rs[0].sumget.toString() : '',
        "exp1": rs[0].exp1 ? rs[0].exp1.toString() : '',
        "exp2": rs[0].exp2 ? rs[0].exp2.toString() : '',
        "exp3": rs[0].exp3 ? rs[0].exp3.toString() : '',
        "exp4": rs[0].exp4 ? rs[0].exp4.toString() : '',
        "exp5": rs[0].exp5 ? rs[0].exp5.toString() : '',
        "exp6": rs[0].exp6 ? rs[0].exp6.toString() : '',
        "exp7": rs[0].exp7 ? rs[0].exp7.toString() : '',
        "exp8": rs[0].exp8 ? rs[0].exp8.toString() : '',
        "exp9": rs[0].exp9 ? rs[0].exp9.toString() : '',
        "exp10": rs[0].exp10 ? rs[0].exp10.toString() : '',
        "sumpay": rs[0].sumpay ? rs[0].sumpay.toString() : '',
        "sumnet": rs[0].sumnet ? rs[0].sumnet.toString() : '',
        "daykey": rs[0].daykey ? rs[0].daykey.toString() : '',
        "money4txt": rs[0].money4txt ? rs[0].money4txt.toString() : '',
        "money5txt": rs[0].money5txt ? rs[0].money5txt.toString() : '',
        "money6txt": rs[0].money6txt ? rs[0].money6txt.toString() : '',
        "money10txt": rs[0].money10txt ? rs[0].money10txt.toString() : '',
        "exp9txt": rs[0].exp9txt ? rs[0].exp9txt.toString() : '',
        "daypay": rs[0].daypay ? rs[0].daypay.toString() : '',
        "notes": rs[0].notes ? rs[0].notes.toString() : '',
        "remarks": rs[0].remarks ? rs[0].remarks.toString() : '',
        "full_name": rs[0].nname ? rs[0].nname.toString() : '',
        "office_txt": rs[0].coff ? rs[0].coff.toString() : '',
        "namebank": rs[0].namebank ? rs[0].namebank.toString() : ''
      }
    }
    res.send(response);
  } catch (error) {
    console.log(error);

    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

router.get('/v2/slips', async (req: Request, res: Response) => {
  try {
    const cid = req.decoded.cid;
    const rs: any = await paySlipModel.getDBSlips(req.db, cid);
    const data = _.orderBy(_.map(rs, (r) => {
      return {
        "year": r.yy.toString(),
        "month": r.mm.toString(),
        "receive": r.daypay.toString(),
        "note": r.notes.toString(),
        "money1": r.money1.toString(),
        "sumnet": r.sumnet.toString(),
        "sumpay": r.sumpay.toString()
      }
    }), ['year', 'month'], ['desc', 'desc'])
    const response = {
      "rows": data,
      "success": true,
      "itemCount": data.length,
    }
    res.send(response);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message });
  }
});

export default router;