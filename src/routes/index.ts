import { ProfileModel } from './../models/profile';
import { FcmModel } from './../models/fcm';
import { PrModel } from './../models/pr';
import { RegisterModel } from './../models/register';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
var routeCache = require('route-cache');

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();
const registerModel = new RegisterModel();
const fcmModel = new FcmModel();
const router: Router = Router();
const prModel = new PrModel();
const profileModel = new ProfileModel();
var FCM = require('fcm-node');
router.get('/', (req: Request, res: Response) => {
  console.log(req.query);
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});


router.get('/privacy', (req: Request, res: Response) => {
  res.render('privacy');
});

router.post('/ekyc', async (req: Request, res: Response) => {
  const body = req.body;
  const client = req.mqttClient;
  let accessToken;
  // {
  //   success: 'อนุมัติ',
  //   sessionId: '2c050c38-fef2-4ef6-b8fc-cf225776f23c',
  //   message: 'session 2c050c38-fef2-4ef6-b8fc-cf225776f23c ทำการยืนยันเสร็จสิ้น'
  // }
  console.log(body);
  if (body.sessionId) {
    const rs: any = await registerModel.ekycGetResult(body.sessionId);
    if (rs.statusCode == 200) {
      if (rs.body.idCardDopaPassed && rs.body.faceVerificationPassed) {
        const info: any = await registerModel.getUser(req.db, rs.body.idCardNumber);
        console.log(rs.body);
        console.log(info[0]);

        if (info[0].sessions_id == body.sessionId) {

          const device: any = await registerModel.getDevice(req.db, rs.body.idCardNumber);


          const obj: any = {
            cid: info[0].cid,
            first_name: info[0].first_name,
            last_name: info[0].last_name,
            session_id: body.sessionId
          }
          const vf: any = await registerModel.verifyKycV2(obj);
          console.log(vf);

          if (vf.ok) {
            // mqtt
            for (const d of device) {
              // const topic = `mymoph/${d.device_id}`;
              console.log(d.fcm_token);

              fcmModel.sendMessage(d.fcm_token, 'ยืนยันตัวตนสำเร็จ', 'ยินดีด้วย คุณสามารถใช้ฟังชั่นต่างๆได้แล้ว', { GOTO: 'PINCODE' })
              // client.publish(topic, '{"topic":"KYC","status":true}');
            }
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

router.get('/testnoti', (req: Request, res: Response) => {
  var fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'flw2WuRSQO-zQ3nqbp0_gn:APA91bEWpcUg1PRjPGCPbPhARRqY5958Bp10-bc_BeabveouvNt5fVAXcYW9SD9lgQMlTVAQMXU5xgGkMZJYc0zVhhrEYKrENCR0Mo4aF69Wo-uU6ERm2Ht_McorHw--9_j0AxMUq67A',
    // to: 'ddVnnCfbS7-v3-nm1tUm0F:APA91bGMIkGrXtA3ssIyDvnON_x-_1PXwFvgAgmX-QIbOHRZd3j-n8NmtAlZcl-cqFRYJQG5ScQVA-LUntnjXA7nXxRvs30EbBmoVa-qIGvTmv_CYHWLsVnEmZ2v-PX28ICKD0d1IkkU',
    // collapse_key: 'your_collapse_key',
    contentAvailable: true,
    // "apns-collapse-id": 1,
    message_id: 1,
    notification: {
      // id: "1",
      title: 'ยืนยันตัวตนสำเร็จ',
      body: 'ยินดีด้วย คุณสามารถใช้ฟังชั่นต่างๆได้แล้ว',
      // tag: "1"
    },

    data: {  //you can send only notification or only data(or include both)
      my_key: 'my value',
      my_another_key: 'my another value',
      GOTO: 'PINCODE'
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
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

router.post('/reset_password', async (req: Request, res: Response) => {
  const code = req.body.code;
  const password = req.body.password;
  const rs: any = await registerModel.resetPasword(code, password, password);
  console.log(rs);
  res.send(rs);
});

router.post('/forgot_password', async (req: Request, res: Response) => {
  const email = req.body.email;
  const rs: any = await registerModel.forgotPasword(email);
  console.log(rs);
  res.send(rs);
});

router.post('/dipchip', async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.session_id;
    const accessToken = req.body.access_token;
    const refreshToken = req.body.refresh_token;
    const cid = sessionId.split("-")[0];
    const fname = sessionId.split("-")[1];
    const lname = sessionId.split("-")[2];
    const newSessionId = `${sessionId.split("-")[0]}-${sessionId.split("-")[3]}`;
    // save session for verify
    const rs: any = await profileModel.getProfile(accessToken);
    if (rs.cid) {
      if (rs.cid == cid) {
        const insert = await profileModel.saveDipchip(req.db, {
          cid, session_id: newSessionId
        })

        // send ISKYC;
        const rsDC: any = await registerModel.verifyKycDipchip({
          cid: cid,
          first_name: fname,
          last_name: lname,
          session_id: newSessionId
        });

        if (rsDC.ok) {
          const device: any = await registerModel.getDevice(req.db, cid);
          for (const d of device) {
            fcmModel.sendMessage(d.fcm_token, 'ยืนยันตัวตนสำเร็จ', 'ยินดีด้วย คุณสามารถใช้ฟังชั่นต่างๆได้แล้ว', { GOTO: 'PINCODE' })
            // client.publish(topic, '{"topic":"KYC","status":true}');
          }
          await registerModel.updateKYCDip(req.db, newSessionId, cid);
          res.send({ ok: true });
        } else {
          console.log(rsDC);

          console.log('error vf');

          res.send({ ok: false, error: 'error vf' });

        }
      } else {
        console.log('cid!=cid');

        res.send({ ok: false, error: 'cid!=cid' });
      }
    } else {
      console.log('errgetpf');

      res.send({ ok: false, error: 'getpf' });
    }
  } catch (error) {
    console.log(error);

    res.send({ ok: false });
  }
});

router.get('/dipchip', async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId;
    const rs: any = await profileModel.getDipchip(req.db, sessionId);
    if (rs.length) {
      console.log(sessionId, rs[rs.length - 1]);
      res.send({ ok: true, rows: rs[rs.length - 1] });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    res.send({ ok: false });
  }
});


export default router;