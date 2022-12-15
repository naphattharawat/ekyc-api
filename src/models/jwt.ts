import * as jwt from 'jsonwebtoken';

export class Jwt {
  private secretKey = process.env.SECRET_KEY;

  sign(playload: any) {
    let token = jwt.sign(playload, this.secretKey, {
      expiresIn: '365d'
    });
    return token;
  }

  signNoExp(playload: any) {
    let token = jwt.sign(playload, this.secretKey);
    return token;
  }

  verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }

  async decoded(token: string) {
    return await jwt.decode(token);
  }

}