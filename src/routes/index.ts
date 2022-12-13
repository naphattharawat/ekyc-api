import { PrModel } from './../models/pr';
import { RegisterModel } from './../models/register';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
var routeCache = require('route-cache');

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();
const registerModel = new RegisterModel();
const router: Router = Router();
const prModel = new PrModel();
router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/privacy', (req: Request, res: Response) => {
  res.render('privacy');
});

router.post('/ekyc', async (req: Request, res: Response) => {
  const body = req.body;
  let accessToken;
  // {
  //   success: 'อนุมัติ',
  //   sessionId: '2c050c38-fef2-4ef6-b8fc-cf225776f23c',
  //   message: 'session 2c050c38-fef2-4ef6-b8fc-cf225776f23c ทำการยืนยันเสร็จสิ้น'
  // }
  console.log(body);
  body.sessionId = 'a0484355-fdc6-402f-a9b2-72863a3bff18';
  if (body.sessionId) {
    const rs: any = await registerModel.ekycGetResult(body.sessionId);
    if (rs.statusCode == 200) {
      if (rs.body.idCardDopaPassed && rs.body.faceVerificationPassed) {
        const info: any = await registerModel.getUser(req.db, rs.body.idCardNumber);
        if (info[0].sessions_id == body.sessionId) {
          const obj: any = {
            cid: info[0].cid,
            first_name: info[0].first_name,
            last_name: info[0].last_name,
            session_id: body.sessionId
          }
          const vf: any = await registerModel.verifyKycV2(obj);
          console.log(vf);

          if (vf.ok) {
            await registerModel.updateKYC(req.db, body.sessionId);
            res.send({ ok: true });
          } else {
            res.send({ ok: false, error: 'update member ไม่ได้' });
          }
        } else {
          res.send({ ok: false, error: 'ไม่พบ sessionId' })
        }

      } else {
        res.send({ ok: false, error: 'ekyc ไม่สำเร็จ' })
      }

    } else {
      res.send({ ok: false, error: 'get result ไม่ได้' })
    }

  }

});

router.get('/testmq', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.session_id);


  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.post('/testmq', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.session_id);


  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/rss_prmoph', routeCache.cacheSeconds(300), async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const rs: any = await prModel.getPR(id);
    res.send({ ok: true, rows: rs.body });
  } catch (error) {

  }
});



export default router;