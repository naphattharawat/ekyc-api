import Knex = require("knex");

const request = require('request');

export class SessionsModel {

  getSession(db: Knex, cid) {
    return db('devices')
      .where('cid', cid)
      .where('status', 'ONLINE')
      .select('system_name', 'device_id', 'model_version')
  }

  getSessionV2(db: Knex, cid) {
    return db('devices')
      .where('cid', cid)
      .where('status', 'ONLINE')
      .select('os', 'device_id', 'brand', 'model', 'model_marketing','phone_name')
  }


}