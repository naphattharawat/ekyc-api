import Knex = require("knex");



export class WifiMophModel {

  saveMacAddress(db: any, data) {
    return db('device_wifi_moph').insert(data);
  }


  findMacAddress(db: any, cid: any) {
    return db('device_wifi_moph')
      .where({ 'cid': cid })
      .where('is_deleted', 'N');
  }

  removeMacAddress(db: any, cid) {
    return db('device_wifi_moph')
      .update({ 'is_deleted': 'Y' })
      .where({ 'cid': cid });
  }

}

