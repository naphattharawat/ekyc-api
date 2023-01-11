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
fse.ensureDirSync(path.join(uploadDir, 'sessions'));
fse.ensureDirSync(path.join(uploadDir, 'back-error'));
fse.ensureDirSync(path.join(uploadDir, 'front-error'));

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    let pathDir = uploadDir;
    // if (req.originalUrl == '/register/ekyc/face') {
    //   pathDir = path.join(uploadDir, 'face');
    // } else if (req.originalUrl == '/register/ekyc/front') {
    //   pathDir = path.join(uploadDir, 'front');
    // } else if (req.originalUrl == '/register/ekyc/back') {
    //   pathDir = path.join(uploadDir, 'back');
    // }
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
        await registerModel.insertCidEmailProfile(req.db,
          cid,
          email
        );
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
      const rs: any = await registerModel.ekycFace(sessionId, filePath, 'face');      
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

router.post('/ekyc/manual/face', upload.any(), async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycManaual(sessionId, filePath, 'face');
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

router.post('/ekyc/manual/idcard', upload.any(), async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.sessionId;
    if (req.files.length) {
      const filePath = req.files[0].path || null;
      const rs: any = await registerModel.ekycManaual(sessionId, filePath, 'idcard');
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

router.post('/ekyc/edit-data', async (req: Request, res: Response) => {
  try {
    // const sessionId = req.body.sessionId;
    const body = req.body;
    const rs: any = await registerModel.ekycEditData(body.sessionId, body.cid, body.fname, body.lname, body.dob, body.laser);
    console.log(rs);

    if (rs.statusCode == 200) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
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
        if (result.body.faceVerificationPassed && result.body.idCardDopaPassed) {
          if (info.body.idCardNumber && info.body.idCardFirstNameTh && info.body.idCardLastNameTh && sessionId) {
            const obj: any = {
              cid: info.body.idCardNumber,
              first_name: info.body.idCardFirstNameTh,
              last_name: info.body.idCardLastNameTh,
              session_id: sessionId
            }
            const rs: any = await registerModel.verifyKyc(accessToken, obj);
            console.log('verifyKyc', rs);

            if (rs.ok) {
              console.log(info.body);

              await registerModel.updateUser(req.db, info.body.idCardNumber, {
                first_name: info.body.idCardFirstNameTh,
                last_name: info.body.idCardLastNameTh,
                sessions_id: sessionId,
                is_ekyc: result.body.idCardDopaPassed && result.body.faceVerificationPassed ? 'Y' : 'N'
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

router.post('/ekyc/complete/v3', async (req: Request, res: Response) => {
  try {
    let accessToken = req.body.accessToken;
    const sessionId = req.body.sessionId;
    let data: any = {};
    const info: any = await registerModel.ekycGetResult(sessionId);
    if (info.statusCode == 200) {
      if (info.body.idCardNumber.length == 13) {
        await registerModel.updateUserProfile(req.db, info.body.idCardNumber,
          info.body.idCardFirstNameTh,
          info.body.idCardLastNameTh,
          sessionId
        );
      } else {
        data.ok = false;
        data.error_code = 7;
      }
      const cp: any = await registerModel.ekycComplete(sessionId);
      // let status;
      if (cp.statusCode == 200) {
        // waiting,Updated,complete,Canceled  
        if (cp.body.status == 'complete' || cp.body.status == 'completed' || cp.body.status == 'Complete' || cp.body.status == 'Completed') {
          // dopa  ผ่านและรูปผ่าน
          data.status = 'COMPLETED';
          if (info.body.idCardNumber && info.body.idCardFirstNameTh && info.body.idCardLastNameTh && sessionId) {
            const obj: any = {
              cid: info.body.idCardNumber,
              first_name: info.body.idCardFirstNameTh,
              last_name: info.body.idCardLastNameTh,
              session_id: sessionId
            }
            const vk: any = await registerModel.verifyKyc(accessToken, obj);
            console.log('verifyKyc', vk);
            if (vk.ok) {
              console.log(info.body);
              await registerModel.updateUserKyc(req.db, info.body.idCardNumber,
                cp.body.idCardDopaPassed && cp.body.faceVerificationPassed ? 'Y' : 'N'
              );
              data.ok = true;
            } else {
              data.ok = false;
              data.error_code = 1;
              data.error = vk.error;
              data.error_description = vk.error_description;
            }
          } else {
            data.ok = false;
            data.error_code = 2;
          }
        } else if (cp.body.status == 'Updated' || cp.body.status == 'updated') {
          // dopa ไม่ผ่าน
          data.status = 'DOPA_FAILED'
          data.ok = false;
          data.error_code = 3;
        } else if (cp.body.status == 'waiting' || cp.body.status == 'Waiting') {
          if (cp.body.status_dopa) {
            //dopa ผ่าน + รูปไม่ผ่าน ไปอัพโหลด
            data.status = 'WAIT_UPLOAD';
            data.ok = false
            data.error_code = 4;
          } else {
            // dopa ไม่ผ่าน
            data.status = 'DOPA_FAILED'
            data.ok = false;
            data.error_code = 3;
          }
        } else {
          data.ok = false;
          data.status = cp.body.status;
        }

      } else {
        data.ok = false
        data.error_code = 5;
        console.log(cp);

      }
    } else {
      data.ok = false;
      data.error_code = 6;
    }
    // code 7 = เลขบัตรไม่ = 13
    // code 6 = get result error 
    // code 5 = complete error
    // code 4 = compare face ไม่ผ่าน หรือแก้ไขเกิน 3 ตัวอักษร
    // code 3 = Dopa failed
    // code 2 = ข้อมูลไม่สมบูรณ์
    // code 1 = update member ไม่ได้
    res.send(data);
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY);
    res.send({ ok: false, error: error.message, code: HttpStatus.BAD_GATEWAY });
  }
});

export default router;