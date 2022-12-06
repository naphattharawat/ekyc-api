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
fse.ensureDirSync(path.join(uploadDir, 'back-error'));
fse.ensureDirSync(path.join(uploadDir, 'front-error'));

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
    let password = req.body.password;
    let email = req.body.email;
    if (cid && password && email) {
      const obj: any = {
        cid: cid,
        password: password,
        email: email
      }
      const rs: any = await registerModel.register(obj);
      if (rs.ok) {
        await registerModel.saveUser(req.db, {
          cid,
          email
        });
        res.send({ ok: true, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, error: rs.error, error_description: rs.error_description });
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
// // save new request
router.post('/verify-kyc', async (req: Request, res: Response) => {
  try {
    let accessToken = req.body.accessToken;
    let cid = req.body.cid;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let sessionId = req.body.sessionId;
    if (cid && firstName && lastName && sessionId) {
      const obj: any = {
        cid: cid,
        first_name: firstName,
        last_name: lastName,
        session_id: sessionId
      }
      const rs: any = await registerModel.verifyKyc(accessToken, obj);
      if (rs.ok) {
        await registerModel.updateUser(req.db, cid, {
          first_name: firstName,
          last_name: lastName
        });
        res.send({ ok: true, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, error: rs.error, error_description: rs.error_description });
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
// // // save new request
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     let cid = req.body.cid;
//     let firstName = req.body.firstName;
//     let lastName = req.body.lastName;
//     let password = req.body.password;
//     let email = req.body.email;
//     let sessionId = req.body.sessionId;
//     if (cid && firstName && lastName && password && sessionId && email) {
//       const obj: any = {
//         cid: cid,
//         first_name: firstName,
//         last_name: lastName,
//         password: password,
//         session_id: sessionId,
//         email: email
//       }
//       const rs: any = await registerModel.register(obj);
//       await registerModel.saveUser(req.db, {
//         cid,
//         first_name: firstName,
//         last_name: lastName,
//         email
//       });
//       console.log(rs);

//       if (rs.ok) {
//         res.send({ ok: true, code: HttpStatus.OK });
//       } else {
//         res.send({ ok: true, code: HttpStatus.OK });
//       }
//     } else {
//       res.status(HttpStatus.BAD_REQUEST);
//       res.send({ ok: false, code: HttpStatus.BAD_REQUEST, error: 'ข้อมูลไม่ครบถ้วน' })
//     }


//   } catch (error) {
//     res.status(HttpStatus.BAD_GATEWAY);
//     res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
//   }

// });

router.post('/ekyc', async (req: Request, res: Response) => {
  try {
    const rs: any = await registerModel.ekycCreate()
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
      if (rs.statusCode == 200) {
        res.send({ ok: true, message: rs.message })
      } else {
        res.send({ ok: false, message: rs.message })
      }
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
      if (rs.statusCode != 200) {
        const newPath = path.join(uploadDir, 'front-error', sessionId + '_' + Date.now() + path.extname(req.files[0].originalname));
        await fs.renameSync(filePath, newPath);
      }
      // {
      //   message: 'Uploads success',
      //   data: {
      //     title: 'นาย',
      //     fname: 'ณภัทรวัฒน์',
      //     lname: 'สามพวงทอง',
      //     citizenId: '1100400728564',
      //     dob: '2537-12-05'
      //   }
      // }
      if (rs.statusCode == 200) {
        res.send({ ok: true, message: rs.message, data: rs.data })
      } else {
        res.send({ ok: false, message: rs.message })
      }
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
      const rs: any = await registerModel.ekycFace(sessionId, filePath, 'back');
      if (rs.statusCode != 200) {
        const newPath = path.join(uploadDir, 'back-error', sessionId + '_' + Date.now() + path.extname(req.files[0].originalname));
        await fs.renameSync(filePath, newPath);
      }

      if (rs.statusCode == 200) {
        res.send({ ok: true, message: rs.message, data: rs.data })
      } else {
        res.send({ ok: false, message: rs.message })
      }

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
    let data: any = {};
    const rs: any = await registerModel.ekycComplete(sessionId);
    if (rs.message == 'Completed') {
      const info: any = await registerModel.ekycGetResult(sessionId);
      if (info.completed) {
        await registerModel.updateUser(req.db, info.idCardNumber, {
          sessions_id: sessionId,
          is_ekyc: info.idCardDopaPassed && info.faceVerificationPassed ? 'Y' : 'N'
        });
        data = info;
        data.ok = true;
      } else {
        data.ok = false
      }
    } else {
      data.ok = false
    }

    // const info: any = await registerModel.ekycInfoBeforeComplete(sessionId);
    // rs.info = info;
    res.send(data);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

router.post('/ekyc/complete/v2', async (req: Request, res: Response) => {
  try {
    let accessToken = req.body.accessToken;
    const sessionId = req.body.sessionId;
    console.log(sessionId);

    let data: any = {};
    const info: any = await registerModel.ekycGetResult(sessionId);
    if (info.statusCode == 200) {
      const rs: any = await registerModel.ekycComplete(sessionId);
      if (rs.statusCode == 200) {
        const result: any = await registerModel.ekycGetResult(sessionId);
        if (result.faceVerificationPassed && result.idCardDopaPassed) {
          if (info.idCardNumber && info.idCardFirstNameTh && info.idCardLastNameTh && sessionId) {
            const obj: any = {
              cid: info.idCardNumber,
              first_name: info.idCardFirstNameTh,
              last_name: info.idCardLastNameTh,
              session_id: sessionId
            }
            const rs: any = await registerModel.verifyKyc(accessToken, obj);
            console.log('verifyKyc', rs);

            if (rs.ok) {
              console.log(info);

              await registerModel.updateUser(req.db, info.idCardNumber, {
                first_name: info.idCardFirstNameTh,
                last_name: info.idCardLastNameTh,
                sessions_id: sessionId,
                is_ekyc: result.idCardDopaPassed && result.faceVerificationPassed ? 'Y' : 'N'
              });
              data.ok = true;
            } else {
              data.ok = false;
              data.error_code = 1;
              data.error = rs.error;
              data.error_description = rs.error_description;
            }
          } else {
            data.ok = false;
            data.error_code = 2;
          }
        } else {
          data.ok = false;
          data.error_code = 3;
        }
      } else {
        data.ok = false
        data.error_code = 4;
      }
    } else {
      data.ok = false;
      data.error_code = 5;
    }
    res.send(data);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

export default router;