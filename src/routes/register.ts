/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as multer from 'multer';
import * as express from 'express';
import { Router, Request, Response } from 'express';
var generator = require('generate-password');
import { RegisterModel } from '../models/register';
import { Jwt } from '../models/jwt';

const registerModel = new RegisterModel();
const jwtModel = new Jwt();
const router: Router = Router();


const uploadDir = process.env.UPLOAD_TEMP_DIR || './uploads';

fse.ensureDirSync(uploadDir);
fse.ensureDirSync(path.join(uploadDir, 'sessions'));
fse.ensureDirSync(path.join(uploadDir, 'back-error'));
fse.ensureDirSync(path.join(uploadDir, 'front-error'));

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    let pathDir = uploadDir;
    const sessionId = req.body.sessionId
    if (sessionId) {
      fse.ensureDirSync(path.join(uploadDir, 'sessions', sessionId));
      pathDir = path.join(uploadDir, 'sessions', sessionId);
    }
    cb(null, pathDir)
  },
  filename: async function (req, file, cb) {
    let _ext = path.extname(file.originalname);
    let filename = Date.now() + _ext;
    const sessionId = req.body.sessionId
    if (sessionId) {
      if (req.originalUrl == '/register/ekyc/face') {
        filename = sessionId + '_face' + _ext;
      } else if (req.originalUrl == '/register/ekyc/front') {
        filename = sessionId + '_front' + _ext;
      } else if (req.originalUrl == '/register/ekyc/back') {
        filename = sessionId + '_back' + _ext;
      }
    }
    cb(null, filename);
  }
});
let upload = multer({ storage: storage });


router.post('/MobileIdService/api/v2/Sessions', async (req: Request, res: Response) => {
  try {
    const rs: any = await registerModel.ekycCreate()
    saveLog('POST', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions`, '')
    res.status(rs.statusCode);
    res.send(rs.body);
  } catch (error) {
    saveLog('POST', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions`, error.message)
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }

});

router.post('/MobileIdService/api/v2/Sessions/:sessionId/Documents', upload.any(), async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const documentType = req.body.documentType;
  try {
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycUpload(sessionId, filePath, documentType)
      if (rs.statusCode != 200) {
        const newPath = path.join(uploadDir, 'front-error', sessionId + '_' + Date.now() + path.extname(req.files[0].originalname));
        await fs.renameSync(filePath, newPath);
      }
      saveLog('POST', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions/${sessionId}/Documents`, '')
      res.status(rs.statusCode);
      res.send(rs.body);
    } else {
      res.send({ ok: false })
    }
  } catch (error) {
    saveLog('POST', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions/${sessionId}/Documents`, error.message);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/MobileIdService/api/v2/Sessions/:sessionId/manual-selfie', upload.any(), async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const documentType = req.body.documentType;
  try {
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycManaual(sessionId, filePath, documentType);
      saveLog('POST', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions/${sessionId}/manual-selfie`, '');
      res.status(rs.statusCode);
      res.send(rs.body);
    } else {
      saveLog('POST', req.decoded.cid, HttpStatus.BAD_REQUEST, `/MobileIdService/api/v2/Sessions/${sessionId}/manual-selfie`, 'Image not found');
      res.status(HttpStatus.BAD_REQUEST);
      res.send({ ok: false })
    }
  } catch (error) {
    saveLog('POST', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions/${sessionId}/manual-selfie`, error.message);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.get('/MobileIdService/api/v2/Sessions/:sessionId/Result', async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  try {
    const rs: any = await registerModel.ekycGetResult(sessionId);
    saveLog('GET', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions/${sessionId}/Result`, '');
    res.status(rs.statusCode);
    res.send(rs.body);
  } catch (error) {
    saveLog('GET', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions/${sessionId}/Result`, error.message);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/MobileIdService/api/v2/Sessions/:sessionId/edit-information', async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const { idNumber, firstNameTh, lastNameTh, dateOfBirth, laserCode } = req.body;
  try {
    const rs: any = await registerModel.ekycEditData(sessionId, idNumber, firstNameTh, lastNameTh, dateOfBirth, laserCode);
    saveLog('POST', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions/${sessionId}/edit-information`, '');
    res.status(rs.statusCode);
    res.send(rs.body);
  } catch (error) {
    saveLog('POST', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions/${sessionId}/edit-information`, error.message);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.put('/MobileIdService/api/v2/Sessions/:sessionId', async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const updateType = req.body.updateType;
  try {
    const rs: any = await registerModel.ekycComplete(sessionId, updateType);
    saveLog('PUT', req.decoded.cid, rs.statusCode, `/MobileIdService/api/v2/Sessions/${sessionId}`, '');
    res.status(rs.statusCode);
    res.send(rs.body);
  } catch (error) {
    saveLog('PUT', req.decoded.cid, HttpStatus.BAD_GATEWAY, `/MobileIdService/api/v2/Sessions/${sessionId}`, error.message);
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});


async function saveLog(method, cid, status, url, error) {
  const text = `${moment().format('DD-MM-YYYY HH:mm:ss')}\t[${method}]\t${cid}\t${status}\t${url}\t${error}\n`;
  const pathFile = path.join(process.env.PATH_LOG, 'api.log');
  fs.appendFile(pathFile, text, function (err) {
    if (err) throw err;
    // console.log('Saved!');
  });
}

export default router;