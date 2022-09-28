/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as multer from 'multer';
import * as express from 'express';
import { Router, Request, Response } from 'express';

import { RegisterModel } from '../models/register';

const registerModel = new RegisterModel();
const router: Router = Router();


const uploadDir = process.env.UPLOAD_TEMP_DIR || './uploads';

fse.ensureDirSync(uploadDir);

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    let _ext = path.extname(file.originalname);
    cb(null, Date.now() + _ext)
  }
});
let upload = multer({ storage: storage });

// save new request
router.post('/', async (req: Request, res: Response) => {
  try {
    let cid = req.body.cid;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthday = req.body.birthday;
    let laser = req.body.laser;
    let sessionId = req.body.sessionId;
    if (cid && firstName && lastName && moment(birthday, 'YYYY-MM-DD').isValid() && laser) {
      const obj: any = {
        cid: cid,
        firstName: firstName,
        lastName: lastName,
        birthday: birthday,
        laser: laser
      }
      const rs: any = await registerModel.register(obj);
      console.log(rs);

      if (rs.ok) {
        res.send({ ok: true, code: HttpStatus.OK });
      } else {
        res.send({ ok: true, code: HttpStatus.OK });
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST);
      res.send({ ok: false, code: HttpStatus.BAD_REQUEST, error: 'ข้อมูลไม่ครบถ้วน' })
    }


  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }

});

router.post('/ekyc', async (req: Request, res: Response) => {
  try {
    const rs: any = await registerModel.ekycCreate()
    console.log(rs);
    res.send(rs)
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }

});

router.post('/ekyc/face', upload.any(), async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycFace(sessionId, filePath, 'face')
      res.send({ ok: true, message: rs.message })
    } else {
      res.send({ ok: false })
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/ekyc/front', upload.any(), async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycFace(sessionId, filePath, 'idcard')
      console.log(rs);

      res.send({ ok: true, message: rs.message })
    } else {
      res.send({ ok: false })
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/ekyc/back', upload.any(), async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycFace(sessionId, filePath, 'back')
      res.send({ ok: true, message: rs.message })
    } else {
      res.send({ ok: false })
    }
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/ekyc/complete', async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    const rs: any = await registerModel.ekycComplete(sessionId)
    res.send(rs);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});
export default router;