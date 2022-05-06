const crypto = require('crypto');
const { PAYMENT } = require('./gateway');

// var privateKey = "private_key_anda";
// var merchant_code = "T0001";
// var merchant_ref = "INV55567";
// var channel = "BCAVA";




exports.signature = async (merchant_code, channel, merchant_ref, privateKey) => {
  return await crypto.createHmac('sha256', privateKey)
    .update(merchant_code + channel + merchant_ref)
    .digest('hex');
}

exports.signatureClosed = async (merchant_code, privateKey, merchant_ref, amount) => {
  console.log(merchant_code, privateKey, merchant_ref, amount)

  return await crypto.createHmac('sha256', privateKey)
    .update(merchant_code + merchant_ref + amount)
    .digest('hex');
}

exports.signature_callback = async (api_key, payload) => {
  console.log('API Key:', api_key)
  console.log('Payload:', payload)
  return await crypto.createHmac('sha256', api_key)
    .update(JSON.stringify(payload))
    .digest('hex');
}