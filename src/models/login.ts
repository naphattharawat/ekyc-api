
var isJSON = require('is-json');
import axios from 'axios';
export class LoginModel {

  login(username: String, password: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: process.env.mymoph_clientId,
        username: username,
        password: password
      }
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        if (error.response) {
          resolve({ statusCode: error.response.status, error: error.response.data });
        } else {
          resolve({ statusCode: error.status, error: error.message });
        }
      });
    });
  }

  loginQR(clientId: String, sessionId: String, refreshToken: String, accessToken: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/webhook_token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: clientId,
        refresh_token: refreshToken,
        toaccess_tokenken: accessToken,
        session_id: sessionId
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

  refreshToken(refreshToken: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/refresh_token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: process.env.mymoph_clientId,
        refresh_token: refreshToken
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

  saveLog(db, deviceId, type) {
    return db('logs_login').insert({
      device_id: deviceId, type
    })
  }

  getApp(db, appId) {
    return db('apps')
      .where('app_id', appId)
  }
}