const mongoose = require("mongoose");
const PaymentModels = mongoose.Schema({
  user_id: {
    type: String
  },
  uuid: {
    type: String
  },
  merchant_ref: {
    type: String
  },
  customer_name: {
    type: String
  },
  payment_name: {
    type: String
  },
  payment_method: {
    type: String
  },
  pay_code: {
    type: String
  },
  qr_string: {
    type: String
  },
  qr_url: {
    type: String
  }
})



module.exports = mongoose.model('open_pay', PaymentModels);