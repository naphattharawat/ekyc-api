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
        return knexExtendModel.onDuplicate(db, 'payslip', data, [
            'nno',
            'yy',
            'mm',
            'idno',
            'nobank',
            'money1',
            'money2',
            'money3',
            'money4',
            'money5',
            'money6',
            'money7',
            'money8',
            'money9',
            'money10',
            'sumget',
            'exp1',
            'exp2',
            'exp3',
            'exp4',
            'exp5',
            'exp6',
            'exp7',
            'exp8',
            'exp9',
            'exp10',
            'sumpay',
            'sumnet',
            'daykey',
            'money4txt',
            'money5txt',
            'money6txt',
            'money10txt',
            'exp9txt',
            'daypay',
            'notes',
            'remarks',
            'chk',
            'noman',
            'nname',
            'nobank',
            'nposit',
            'coff',
            'cbank',
            'mbphone',
            'dayup',
            'namebank',
            'sakhabank',
            'noffice'])
    }

}