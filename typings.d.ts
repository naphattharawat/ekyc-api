import * as Knex from 'knex';

declare module 'express' {
  interface Request {
    db: any // Actually should be something like `multer.Body`
    knex: any,
    decoded: any // Actually should be something like `multer.Files`.
    files: any
    mqttClient: any
  }
}