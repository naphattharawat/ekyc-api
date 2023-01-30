
const fs = require('fs');
import axios from 'axios';
const FormData = require('form-data');

export class RegisterModel {

  register(data) {
    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/register',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
        session_id: data.session_id
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  verifyKyc(accessToken, data) {
    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/is_kyc',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        session_id: data.session_id
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  verifyKycV2(data) {
    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v2/m/is_kyc',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        session_id: data.session_id
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  verifyKycDipchip(data) {
    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/is_dipchip',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        session_id: data.session_id
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  ekycCreate() {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: 'https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/',
      headers: { apiKey: key, 'Content-Type': 'application/json' }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        // console.error(error);
        reject(error)
      });
    });

  }
  ekycFace(sessionId, filePath, type) {
    const form = new FormData();
    form.append('documentType', type);
    form.append('file', fs.createReadStream(filePath), filePath);
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/Documents`,
      headers: {
        apiKey: key,
        'Content-Type': 'multipart/form-data'
      },
      data: form
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        response.data.statusCode = response.status;
        resolve(response.data);
      }).catch(function (error) {
        // console.error(error);
        reject(error)
      });
    })
  }

  ekycManaual(sessionId, filePath, type) {
    const form = new FormData();
    form.append('documentType', type);
    form.append('file', fs.createReadStream(filePath), filePath);
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/manual-selfie`,
      headers: {
        apiKey: key,
        'Content-Type': 'multipart/form-data'
      },
      data: form
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        response.data.statusCode = response.status;
        resolve(response.data);
      }).catch(function (error) {
        // console.error(error);
        reject(error)
      });
    })
  }

  ekycComplete(sessionId) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'PUT',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}`,
      headers: {
        apiKey: key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: { updateType: 'Complete' }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
      });
    })
  }

  ekycEditData(sessionId, cid, fname, lname, dob, laser) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/edit-information`,
      headers: {
        apiKey: key,
        'Content-Type': 'application/json'
      },
      data: {
        "idNumber": cid,
        "firstNameTh": fname,
        "lastNameTh": lname,
        "dateOfBirth": dob,
        "laserCode": laser
      }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
      });
    })
  }
  ekycGetResult(sessionId) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'GET',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/Result`,
      headers: {
        apiKey: key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
      });
    })

  }
  ekycInfoBeforeComplete(sessionId) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'GET',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/IdCard`,
      headers: {
        apiKey: key,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        // console.error(error);
        reject(error)
      });
    })

  }

  saveUser(db, data) {
    return db('users').insert(data);
  }

  updateUser(db, cid, data) {
    return db('users').update(data).where('cid', cid);
  }

  insertCidEmailProfile(db, cid, email, passwordInternet) {
    const sql = `insert into users (cid,email,password_internet) values (?,?,?) 
    on duplicate key update email=?,password_internet=?`;
    return db.raw(sql, [cid, email, passwordInternet, email, passwordInternet])
  }
  insertUserProfile(db, cid, firstName, lastName) {
    const sql = `insert into users (cid,first_name,last_name) values (?,?,?) 
    on duplicate key update first_name=?,last_name=?`;
    return db.raw(sql, [cid, firstName, lastName, firstName, lastName])
  }
  updateUserProfile(db, cid, firstName, lastName, sessionId) {
    const sql = `insert into users (cid,first_name,last_name,sessions_id) values (?,?,?,?) 
    on duplicate key update first_name=?,last_name=?,sessions_id=?`;
    return db.raw(sql, [cid, firstName, lastName, sessionId, firstName, lastName, sessionId])
  }

  updateUserKyc(db, cid, isKyc) {
    return db('users').update({ 'is_ekyc': isKyc }).where('cid', cid);
  }

  getUser(db, cid) {
    return db('users').where('cid', cid);
  }

  getDevice(db, cid) {
    return db('devices')
      .where('cid', cid)
      .where('status', 'ONLINE');
  }
  getDeviceFcm(db, cid) {
    return db('devices')
      .where('cid', cid)
      .where('status', 'ONLINE')
      .groupBy('fcm_token')
  }


  updateKYC(db, sessionId) {
    return db('users')
      .where('sessions_id', sessionId)
      .update('is_ekyc', 'Y');
  }

  updateKYCDip(db, sessionId, cid) {
    return db('users as u')
      .join('dipchip_sessions as d', 'u.cid', 'd.cid')
      .where('d.session_id', sessionId)
      .where('d.cid', cid)
      .update('u.is_ekyc', 'Y');
  }


  resetPasword(code, password, passwordConf) {
    const options = {
      method: 'POST',
      url: `https://members.moph.go.th/api/v1/user/reset_password/${code}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        password: password,
        passwordConf: passwordConf
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  forgotPasword(email) {
    const options = {
      method: 'POST',
      url: `https://members.moph.go.th/api/v1/m/forgot_password`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: email
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  generateUserInternet(data) {
    const options = {
      method: 'POST',
      url: 'http://203.157.103.125/member',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "username": `mymoph_${data.cid}`,
        "firstName": data.firstName,
        "lastName": data.lastName,
        "password": data.password,
        "cid": data.cid,
        "email": data.email,
        "type": "MYMOPH"
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        reject(error)
      });
    });
  }
}