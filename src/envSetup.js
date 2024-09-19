import axios from 'axios';
import http from 'http';

require('dotenv').config();

http.globalAgent.keepAlive = true;
const HttpAgent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const agentOptions = {
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000, // active socket keepalive for 60 seconds
  freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
  // follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,
};

export const axiosInstance = axios.create({
  httpAgent: new HttpAgent(agentOptions),
  httpsAgent: new HttpsAgent(agentOptions),
});

const rax = require('retry-axios');
rax.attach(axiosInstance);
rax.attach(axios);

export const Log = {
  // fun with colors
  error: (...arg) => console.log('\x1b[31m%s', ...arg),
  info: (...arg) => console.log('\x1b[33m%s\x1b[0m', ...arg),
  green: (...arg) => console.log('\x1b[32m%s', ...arg),
  blue: (...arg) => console.log('\x1b[1m%s', ...arg),
};
