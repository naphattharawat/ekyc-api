import Knex = require("knex");

const request = require('request');

export class DeviceModel {

  saveDevice(db: Knex, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,system_name,version,model,model_version,last_login,status) values  (?,?,?,?,?,?,?,${db.fn.now()},'ONLINE') on duplicate key update 
    fcm_token=?,system_name=?,version=?,model=?,model_version=?,last_login=${db.fn.now()},status='ONLINE'`;
    return db.raw(sql, [data.device_id, data.cid, data.fcm_token, data.system_name, data.version, data.model, data.model_version, data.fcm_token, data.system_name, data.version, data.model, data.model_version])
    // return db('devices').insert(data);
  }

  saveDeviceBio(db: Knex, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,last_login) values  (?,?,?,${db.fn.now()}) on duplicate key update 
    fcm_token=?,last_login=${db.fn.now()}`;
    return db.raw(sql, [data.device_id, data.cid, data.fcm_token, data.fcm_token])
    // return db('devices').insert(data);
  }

}

