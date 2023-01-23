const request = require('request');
var isJSON = require('is-json');
export class LoginModel {

  login(username: String, password: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        client_id: process.env.mymoph_clientId,
        username: username,
        password: password
      }
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          if (response.statusCode == 200) {
            resolve(JSON.parse(body))
          } else {
            reject(body);
          }

        }
        // console.log(body);
      });
    });
  }

  loginQR(clientId: String, sessionId: String, refreshToken: String, accessToken: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/webhook_token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        client_id: clientId,
        refresh_token: refreshToken,
        toaccess_tokenken: accessToken,
        session_id: sessionId
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

  refreshToken(refreshToken: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/oauth/refresh_token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        client_id: process.env.mymoph_clientId,
        refresh_token: refreshToken
      }
    };
    return new Promise<void>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          if (isJSON(body)) {
            resolve(JSON.parse(body))
          } else {
            reject({ ok: false })
          }
        }
        // console.log(body);
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