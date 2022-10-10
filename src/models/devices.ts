import Knex = require("knex");

const request = require('request');

export class DeviceModel {

  saveDevice(db: Knex, data: any) {
    const sql = `insert into devices 
    (device_id,fcm_token,system_name,version,model,model_version) values  (?,?,?,?,?,?) on duplicate key update 
    fcm_token=?,system_name=?,version=?,model=?,model_version=?`;
    return db.raw(sql, [data.device_id, data.fcm_token, data.system_name, data.version, data.model, data.model_version,
    data.fcm_token, data.system_name, data.version, data.model, data.model_version])
    // return db('devices').insert(data);
  }

}

