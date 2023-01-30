import axios from 'axios';



export class MyMophWebModel {

  getAllAdvertise() {
    const options = {
      method: 'GET',
      url: `https://mymoph.moph.go.th/mymoph_api/news/all/0/10`,
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        // console.log(response.data)
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
      });
    })
  }

  getAdvertiseImage(image_name) {
    const options = {
      method: 'GET',
      url: `https://mymoph.moph.go.th/mymoph_api/news/cover/${image_name}`,
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    };
    return new Promise<any>((resolve, reject) => {
      axios(options).then(function (response) {
        // console.log(response.data)
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        reject({ statusCode: error.status, error: error });
      });
    })
  }


}

