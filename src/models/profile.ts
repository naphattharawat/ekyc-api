const request = require('request');
var isJSON = require('is-json');
var axios = require("axios").default;

export class ProfileModel {

  getProfile(token: String) {

    const options = {
      method: 'GET',
      url: 'https://members.moph.go.th/api/v1/m/user',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    };
    return new Promise<void>((resolve, reject) => {
      axios.request(options).then(function (response) {
        resolve(response.data)
      }).catch(function (error) {
        reject(error)
      });
    });
  }

  getDipchip(db, sessionId) {
    return db('dipchip_sessions')
      .select('cid', 'session_id')
      .where({
        'session_id': sessionId
      });
  }

  saveDipchip(db, data) {
    return db('dipchip_sessions').insert(data);
  }


}