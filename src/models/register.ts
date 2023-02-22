
const fs = require('fs');
import axios from 'axios';
const FormData = require('form-data');

export class RegisterModel {


  ekycCreate() {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'POST',
      url: 'https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/',
      headers: { apiKey: key, 'Content-Type': 'application/json' }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
      });
    });

  }
  ekycUpload(sessionId, filePath, type) {
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
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
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
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}/manaual-selfie`,
      headers: {
        apiKey: key,
        'Content-Type': 'multipart/form-data'
      },
      data: form
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
      });
    })
  }

  ekycComplete(sessionId, updateType) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'PUT',
      url: `https://rmsservice.moph.go.th/MobileIdService/api/v2/Sessions/${sessionId}`,
      headers: {
        apiKey: key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: { updateType: updateType }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
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
        resolve({ statusCode: error.response.status, body: error.response.data });
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
        resolve({ statusCode: error.response.status, body: error.response.data });
      });
    })

  }


  getProfile(token: String) {
    const options = {
      method: 'GET',
      url: 'https://members.moph.go.th/api/v1/m/user',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
      });
    });
  }

  login(username, password) {
    var options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: process.env.member_client_id,
        username: username,
        password: password
      }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, body: error.response.data });
      });
    });
  }
}