import { Jwt } from './jwt';
import e = require("express");

const request = require('request');
const moment = require('moment');
const jwtModel = new Jwt();
export class HrModel {

    authen() {
        var options = {
            'method': 'POST',
            'url': 'http://203.157.102.224/auth/create-token',
            'headers': {
                'api-key': process.env.hr_key
            }
        };
        return new Promise<void>((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(JSON.parse(body))
                }
            });
        });
    }

    refreshToken(refreshToken) {
        var options = {
            'method': 'POST',
            'url': 'http://203.157.102.224/auth/refresh-token',
            'headers': {
                'api-key': refreshToken
            }
        };
        return new Promise<void>((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(JSON.parse(body))
                }
            });
        });
    }

    async checkToken(accessToken, refreshToken) {
        if (accessToken) {
            // console.log('accessToken', accessToken);
            const decoded: any = await jwtModel.decoded(accessToken);
            console.log(decoded);

            let expiryDate = moment(decoded.exp, 'X')
            let now = moment();
            if (expiryDate.isBefore(now)) {
                const r: any = await this.refreshToken(refreshToken);
                if (r.ok) {
                    return {
                        ok: true,
                        access_token: r.access_token,
                        refresh_token: refreshToken
                    }
                }
            } else {
                return {
                    ok: true,
                    access_token: accessToken,
                    refresh_token: refreshToken
                }
            }
        } else {
            const auth: any = await this.authen();
            if (auth.ok) {
                return auth;
            } else {
                return { ok: false };
            }
        }
    }

    getData(cid, accessToken) {
        var options = {
            'method': 'GET',
            'url': `http://203.157.102.224/api/005/01/data?citizenNo=${cid}`,
            'headers': {
                'accept': 'application/json',
                'api-key': accessToken
            }
        };
        return new Promise<void>((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(JSON.parse(body))
                }
            });
        });
    }


}