/// <reference path="../typings.d.ts" />

require('dotenv').config();

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as HttpStatus from 'http-status-codes';
import * as express from 'express';
import * as cors from 'cors';
import * as moment from 'moment';
import * as fs from 'fs';
// import Knex = require('knex');
import { Router, Request, Response, NextFunction } from 'express';
import { Jwt } from './models/jwt';

import loginRoute from './routes/login';
import registerRoute from './routes/register';
import publicRoute from './routes/public';

// Assign router to the express.Router() instance
const app: express.Application = express();

const jwt = new Jwt();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.engine('.ejs', ejs.renderFile);
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());

let connection: any = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  debug: false
}

let db = require('knex')({
  client: 'mysql',
  connection: connection,
  pool: {
    min: 0,
    max: 100,
    afterCreate: (conn, done) => {
      conn.query('SET NAMES utf8', (err) => {
        done(err, conn);
      });
    }
  },
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = db;
  next();
});

let checkAuth = (req: Request, res: Response, next: NextFunction) => {
  let token: any = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;
      next();
    }, err => {
      saveLog('??', '0000000000000', 401, req.originalUrl, 'UNAUTHORIZED');
      res.status(401);
      return res.send({
        ok: false,
        error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        code: HttpStatus.UNAUTHORIZED
      });
    });
}

async function saveLog(method, cid, status, url, error) {
  const text = `${moment().format('DD-MM-YYYY HH:mm:ss')}\t[${method}]\t${cid}\t${status}\t${url}\t${error}\n`;
  const pathFile = path.join(process.env.PATH_LOG, 'api.log');
  fs.appendFile(pathFile, text, function (err) {
    if (err) throw err;
    // console.log('Saved!');
  });
}

app.use('/login', loginRoute);
app.use('/public', publicRoute);
app.use('/', checkAuth, registerRoute);

//error handlers

if (process.env.NODE_ENV === 'development') {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      }
    });
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      ok: false,
      code: HttpStatus.NOT_FOUND,
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
});

export default app;
