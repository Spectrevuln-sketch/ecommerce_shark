const mongoose = require("mongoose");
const ClosePayModel = mongoose.Schema({
  user_id: {
    type: String
  },
  // key
  reference: {
    type: String
  },
  merchant_ref: {
    type: String
  },
  payment_method: {
    type: String
  },
  payment_name: {
    type: String
  },
  customer_name: {
    type: String
  },
  customer_email: {
    type: String
  },
  customer_phone: {
    type: String
  },
  amount: {
    type: Number
  },
  fee_merchant: {
    type: Number
  },
  fee_customer: {
    type: Number
  },
  total_fee: {
    type: Number
  },
  amount_received: {
    type: Number
  },
  pay_code: {
    type: String
  },
  status: {
    type: String
  },
  expired_time: {
    type: Number
  },
  total_amount: {
    type: Number
  },
  is_closed_payment: {
    type: Number
  },
  paid_at: {
    type: String
  },
  note: {
    type: String
  }
})


module.exports = mongoose.model("close_pay", ClosePayModel);