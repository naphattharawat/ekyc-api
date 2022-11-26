const request = require('request');
const fs = require('fs');
export class RegisterModel {

  register(data) {
    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/register',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
        session_id: data.session_id
      }
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body))
        }
        // console.log(body);
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
      body: {
        cid: data.cid,
        first_name: data.first_name,
        last_name: data.last_name,
        session_id: data.session_id
      },
      json: true
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          // console.log(body);
          resolve(body)
        }
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
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body));
        }
      });
    });

  }
  ekycFace(sessionId, filePath, type) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/Documents`,
      headers: {
        apiKey: key,
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        documentType: type,
        file: {
          value: fs.createReadStream(filePath),
          options: { filename: filePath, contentType: null }
        }
      }
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          const rep = JSON.parse(body);
          rep.statusCode = response.statusCode;
          resolve(rep);
        }
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
      form: { updateType: 'Complete' }
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body));
        }
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
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body));
        }
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
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body));
        }
      });
    })

  }

  saveUser(db, data) {
    return db('users').insert(data);
  }
  updateUser(db, cid, data) {
    return db('users').update(data).where('cid', cid);
  }


  updateKYC(db, sessionId) {
    return db('users')
      .where('sessions_id', sessionId)
      .update('is_kyc', 'Y');
  }
}