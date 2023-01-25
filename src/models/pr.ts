import Knex = require("knex");
import axios from 'axios';



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
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
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

