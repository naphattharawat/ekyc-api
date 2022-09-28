const request = require('request');

export class LoginModel {

  getProfile(token: String) {

    const options = {
      method: 'POST',
      url: 'https://members.moph.go.th/api/v1/m/user',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
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


}