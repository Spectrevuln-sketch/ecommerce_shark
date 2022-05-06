const axios = require('axios');
const { PAYMENT, ORIGIN_ALLOW } = require('./gateway');
exports.call_payment = axios.create({
  baseURL: PAYMENT.TRIPAY_SENDBOX,
  headers: {
    'Authorization': 'Bearer ' + PAYMENT.API_KEY_SENDBOX,
  },
})

exports.callback_payment = axios.create({
  // baseURL: ORIGIN_ALLOW.ORIGIN_CLIENT2,
  baseURL: ORIGIN_ALLOW.ORIGIN_CLIENT2,
})