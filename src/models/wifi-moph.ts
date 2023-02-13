import Knex = require("knex");



export class WifiMophModel {

  saveMacAddress(db: any, data) {
    return db('device_wifi_moph').insert(data);
  }


  findMacAddress(db: any, deviceId: any) {
    return db('device_wifi_moph')
      .where({ 'device_id': deviceId })
      .where('is_deleted', 'N');
  }

  removeMacAddress(db: any, deviceId) {
    return db('device_wifi_moph').update({ 'is_deleted': 'Y' });
  }

}

