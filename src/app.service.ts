import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello() {
    return { hello: 'proxy server' };
  }

  async triggerRequest(options: any) {
    let response;

    try {
      response = await this.triggerAxios(options);
    } catch (error) {
      global.console.error(
        options.method,
        new Date(),
        error.response.status,
        options.url,
      );
      return { error };
    }
    global.console.log(
      options.method,
      new Date(),
      response.status,
      options.url,
    );
    return response;
  }
  async triggerAxios(options: any) {
    return new Promise((resolve, reject) => {
      axios(options)
        .then((response) => {
          resolve({
            success: true,
            data: response.data,
            status: response.status,
            headers: response.headers,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}


