import Knex = require("knex");



export class DeviceModel {

  saveDevice(db: any, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,system_name,version,model,model_version,last_login,status) values  (?,?,?,?,?,?,?,${db.fn.now()},'ONLINE') on duplicate key update 
    fcm_token=?,system_name=?,version=?,model=?,model_version=?,last_login=${db.fn.now()},status='ONLINE'`;
    return db.raw(sql, [data.device_id, data.cid, data.fcm_token, data.system_name, data.version, data.model, data.model_version, data.fcm_token, data.system_name, data.version, data.model, data.model_version])
    // return db('devices').insert(data);
  }
  saveDeviceV2(db: any, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,os,version,
      model,model_marketing,phone_name,sdk,brand,
      last_login,status) values  (?,?,?,?,?,?,?,?,?,?,${db.fn.now()},'ONLINE') on duplicate key update 
    fcm_token=?,os=?,version=?,model=?,model_marketing=?,phone_name=?,sdk=?,brand=?,last_login=${db.fn.now()},status='ONLINE'`;
    return db.raw(sql, [
      data.device_id, data.cid, data.fcm_token, data.os, data.version,
      data.model, data.model_marketing, data.phone_name, data.sdk, data.brand,
      data.fcm_token, data.os, data.version, data.model, data.model_marketing, data.phone_name, data.sdk, data.brand])
    // return db('devices').insert(data);
  }

  saveDeviceBio(db: any, data: any) {
    const sql = `insert into devices 
    (device_id,cid,fcm_token,last_login) values  (?,?,?,${db.fn.now()}) on duplicate key update 
    fcm_token=?,last_login=${db.fn.now()}`;
    return db.raw(sql, [data.device_id, data.cid, data.fcm_token, data.fcm_token])
    // return db('devices').insert(data);
  }

}

