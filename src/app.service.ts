import { Injectable } from '@nestjs/common';
import axios from 'axios';
const https = require('https');

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
            global.console.error(options.method, new Date(), error.response.status, options.url);
            return { error };
        }
        global.console.log(options.method, new Date(), response.status, options.url);
        return response;
    }

    async triggerAxios(options: any) {
        if (options?.httpsAgent?.cert || options?.httpsAgent?.pfx) {
            const { cert, key, passphrase, pfx } = options.httpsAgent;
            delete options.httpsAgent;

            const agent: any = {};

            if (cert) agent.cert = cert;
            if (key) agent.key = key;
            if (passphrase) agent.passphrase = passphrase;
            if (pfx) agent.pfx = Buffer.from(pfx, 'base64');

            agent.rejectUnauthorized = true;

            const httpsAgent = new https.Agent(agent);
            options.httpsAgent = httpsAgent
        }
        options.maxBodyLength = Infinity;

        return new Promise((resolve) => {
            axios.request(options)
                .then((response) => {
                    resolve({
                        success: true,
                        data: response.data,
                        status: response.status,
                        headers: response.headers,
                    });
                })
                .catch((error) => {
                    resolve({
                        success: false,
                        data: error?.response?.data || error.toString(),
                        status: error?.response?.status || 404,
                        headers: error?.response?.headers,
                    });
                });
        });
    }
}
