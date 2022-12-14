import Knex = require("knex");

const request = require('request');

export class DeviceModel {

  saveDevice(db: Knex, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,system_name,version,model,model_version,last_login) values  (?,?,?,?,?,?,?,?) on duplicate key update 
    fcm_token=?,system_name=?,version=?,model=?,model_version=?,last_login=?`;
    return db.raw(sql, [data.device_id, data.cid, data.fcm_token, data.system_name, data.version, data.model, data.model_version,
    db.fn.now(),data.fcm_token, data.system_name, data.version, data.model, data.model_version, db.fn.now()])
    // return db('devices').insert(data);
  }

}

