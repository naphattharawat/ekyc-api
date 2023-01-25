const request = require('request');
import { KnexExtendModel } from './knexExtend';
var isJSON = require('is-json');
var axios = require("axios").default;
const knexExtendModel: KnexExtendModel = new KnexExtendModel();
export class PaySlipModel {

    getSlip(accessToken, yy, mm) {
        try {
            const options = {
                method: 'GET',
                url: `https://payslip-ops.moph.go.th/api/v1/m/user/slip/${yy}/${mm}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
            return new Promise<void>((resolve, reject) => {
                axios.request(options).then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    } else {
                        reject({ ok: false })
                    }
                }).catch(function (error) {
                    reject(error)
                });
            });
        } catch (error) {
            return ({ ok: false, error: error });
        }
    }

    getSlips(accessToken) {
        try {
            const options = {
                method: 'GET',
                url: 'https://payslip-ops.moph.go.th/api/v1/m/user/slips',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
            return new Promise<void>((resolve, reject) => {
                axios.request(options).then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data)
                    } else {
                        reject({ ok: false })
                    }
                }).catch(function (error) {
                    reject(error)
                });
            });

        } catch (error) {
            return ({ ok: false, error: error });
        }
    }

    savePayslip(db: any, data) {
        return db('payslip').insert(data).onConflict('nauto').merge()
    }


}