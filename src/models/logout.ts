const request = require('request');

export class LogoutModel {

  setStatus(db, deviceId, status) {
    return db('devices')
      .update('status', status)
      .where('device_id', deviceId);
  }

  saveLog(db, deviceId, type) {
    return db('logs_login').insert({
      device_id: deviceId, type
    })
  }
}