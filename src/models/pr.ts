import Knex = require("knex");

const request = require('request');

export class PrModel {

  getPR(id) {
    const key = process.env.ekyc_appId;
    const options = {
      method: 'GET',
      url: `https://pr.moph.go.th/rss_prmoph.php?id=${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    };
    return new Promise<any>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject({ statusCode: response.statusCode, error: error });
        } else {
          resolve({ statusCode: response.statusCode, body: body });
        }
      });
    })
  }

  getPRDB(db: any, id) {
    return db('rss_moph').where('id', id);
  }

  updatePRDB(db: any, id, data) {
    return db('rss_moph').where('id', id).update('data', data);
  }

}

