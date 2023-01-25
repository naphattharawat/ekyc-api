
var isJSON = require('is-json');
var axios = require("axios").default;
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

    getDBSlips(db, cid) {
        return db('payslip').where('idno', cid).select('yy', 'mm', 'daypay', 'notes', 'money1', 'sumnet', 'sumpay');
    }

    getDBSlipMonth(db, cid, yy, mm) {
        return db('payslip')
            .where('idno', cid)
            .where('yy', yy)
            .where('mm', mm)
    }


}