const request = require('request');
const fs = require('fs');
export class RegisterModel {

  register(data) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v2/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        client_id: process.env.mymoph_clientId
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
          resolve(JSON.parse(body));
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

}