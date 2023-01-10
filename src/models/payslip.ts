const request = require('request');

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
                request(options, function (error, response, body) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(JSON.parse(body))
                    }
                });
            });
        } catch (error) {
            return [];
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
                request(options, function (error, response, body) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(JSON.parse(body))
                    }
                });
            });

        } catch (error) {
            return [];
        }
    }


}