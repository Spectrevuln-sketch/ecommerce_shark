const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const middleware = require("../middleware");
const PaymentModels = require('../models/paymentModels');
const { call_payment, callback_payment } = require("../utils/axiosInstans");
const { signature, signatureClosed, signature_callback } = require("../utils/signature");
const { RESPONSE, PAYMENT, PRIVATE, INV } = require("../utils/gateway");
const ClosePayModel = require('../models/closePayModels.js');

// GET: instraction
router.get("/instraction", async (req, res) => {

  const {
    code
  } = req.query
  if (code) {

    let paymentInstruction = await call_payment.get('/payment/instruction', {
      params: {
        code
      }
    })
    console.log('Payment', paymentInstruction.data);
    if (paymentInstruction.data.success === true) {
      return res.status(200).json({
        responseCode: RESPONSE.SUCCESS,
        data: paymentInstruction.data.data
      })
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseDesc: 'INVALID RESPONSE'
      })
    }
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE'
    })
  }

});

// GET: Channel
router.get('/channel', async (req, res) => {
  const {
    code
  } = req.query
  if (code !== undefined) {
    let PaymentChannel = await call_payment.get(`/merchant/payment-channel?code=${code}`)
    console.log('Payment Channel', PaymentChannel.data);
    if (PaymentChannel.data.success === true) {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: RESPONSE.SUCCESS,
        data: PaymentChannel.data.data
      })
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseDesc: 'INVALID RESPONSE',
        errorDesc: PaymentChannel.data.message
      })
    }
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'MUST PROVIDE CODE',
    })
  }
})

router.get('/all-channel', async (req, res) => {
  let PaymentChannel = await call_payment.get('/merchant/payment-channel')
  console.log('All Channel', PaymentChannel.data.data)
  if (PaymentChannel.data.success === true) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: RESPONSE.SUCCESS,
      data: PaymentChannel.data.data
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: PaymentChannel.data.message
    })
  }
})

router.get('/calculator', async (req, res) => {
  const {
    code,
    amount
  } = req.query
  console.log(code, amount)
  if (code === undefined || amount === undefined)
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: 'Please provide code && amount'
    })

  if (code && amount) {

    let Calculator = await call_payment.get('/merchant/fee-calculator', {
      params: {
        code,
        amount,
      }
    })
    if (Calculator.data.success === true) {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'SUCCESS',
        data: Calculator.data.data
      })
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseDesc: 'INVALID RESPONSE',
        errorDesc: Calculator.data.message
      })
    }
  } else {
    let Calculator = await call_payment.get('/merchant/fee-calculator', {
      params: {
        amount,
      }
    })
    if (Calculator.data.success === true) {
      return res.status(200).json({
        responseCode: '00',
        responseDesc: 'SUCCESS',
        data: Calculator.data.data
      })
    } else {
      return res.status(400).json({
        responseCode: 400,
        responseDesc: 'INVALID RESPONSE',
        errorDesc: Calculator.data.message
      })
    }
  }
})

router.post('/requset_closed', async (req, res) => {
  const {
    method,
    customer_name,
    user_id
  } = req.body
  if (method === undefined || customer_name === undefined || user_id === undefined)
    return res.status(400).send({
      responseCode: RESPONSE._CODE_FILED,
      responseDesc: RESPONSE.FAILED,
      errorDesc: 'Method, Customer Name, User ID Must Provide'
    })
  let Sign = await signature(PAYMENT.KODE_MERCHANT, method, INV.SHARK86, PRIVATE.KEY_SHARK86);
  let RequestTransaction = await call_payment.post('/open-payment/create', {
    method,
    customer_name,
    signature: Sign
  })
  if (RequestTransaction.data.success === true) {
    let newPayment = new PaymentModels({
      user_id,
      uuid: RequestTransaction.data.data.uuid,
      merchant_ref: RequestTransaction.data.data.merchant_ref,
      customer_name: RequestTransaction.data.data.customer_name,
      payment_name: RequestTransaction.data.data.payment_name,
      payment_method: RequestTransaction.data.data.payment_method,
      pay_code: RequestTransaction.data.data.pay_code,
      qr_string: RequestTransaction.data.data.qr_string,
      qr_url: RequestTransaction.data.data.qr_url,
    })

    await newPayment.save()

    return res.status(200).json({
      responseCode: '00',
      responseDesc: RESPONSE.SUCCESS,
      data: RequestTransaction.data.data
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})


router.get('/detail-payment', async (req, res) => {
  const { uuid } = req.query

  let PaymentDetail = await call_payment.get(`open-payment/${uuid}/detail`)
  if (PaymentDetail.data.success === true) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: PaymentDetail.data.data
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})

router.get('/daftar-pembayaran', async (req, res) => {
  const { uuid } = req.query
  const DaftarPembayaran = await call_payment.get(`/open-payment/${uuid}/transactions`)
  if (DaftarPembayaran.data.success === true) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: DaftarPembayaran.data.data
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})

router.post('/transaction-dev', async (req, res) => {
  const {
    method,
    customer_name,
    customer_email,
    customer_phone,
    user_id
  } = req.body


  if (!method || !customer_name || !customer_phone || !customer_email || !user_id) {

    console.log(method, customer_name, customer_phone, customer_email, user_id)
    return res.status(400).send({
      responseCode: RESPONSE._CODE_FILED,
      responseDesc: RESPONSE.FAILED
    });
  } else {
    try {

      var merchant_ref = `${INV.SHARK86}`;
      var amount = parseInt(req.body.amount);

      var expiry = parseInt(Math.floor(new Date() / 1000) + (24 * 60 * 60));
      let signature = await signatureClosed(`${PAYMENT.KODE_MERCHANT}`, `${PAYMENT.PRIVATE_SENDBOX}`, merchant_ref, amount);

      var payload = {
        'method': `${method}`,
        'merchant_ref': merchant_ref,
        'amount': amount,
        'customer_name': `${customer_name}`,
        'customer_email': `${customer_email}`,
        'customer_phone': `${customer_phone}`,
        'order_items': [
          {
            'name': INV.SHARK86,
            'price': amount,
            'quantity': 1,
          },
        ],
        'expired_time': expiry,
        'signature': signature
      }

      let RequestTransaction = await call_payment.post('/transaction/create', payload);
      console.log('Validate :', RequestTransaction.data.data)
      if (RequestTransaction.data.success === true) {
        let newPayment = new ClosePayModel({
          user_id,
          reference: RequestTransaction.data.data.reference,
          merchant_ref: RequestTransaction.data.data.merchant_ref,
          payment_method: RequestTransaction.data.data.payment_method,
          payment_name: RequestTransaction.data.data.payment_name,
          customer_name: RequestTransaction.data.data.customer_name,
          customer_email: RequestTransaction.data.data.customer_email,
          customer_phone: RequestTransaction.data.data.customer_phone,
          amount: RequestTransaction.data.data.amount,
          fee_merchant: RequestTransaction.data.data.fee_merchant,
          fee_customer: RequestTransaction.data.data.fee_customer,
          total_fee: RequestTransaction.data.data.total_fee,
          amount_received: RequestTransaction.data.data.amount_received,
          pay_code: RequestTransaction.data.data.pay_code,
          status: RequestTransaction.data.data.status,
          expired_time: RequestTransaction.data.data.expired_time,
        })

        let UserBase = await newPayment.save()

        return res.status(200).json({
          responseCode: '00',
          responseDesc: RESPONSE.SUCCESS,
          data: RequestTransaction.data.data,
          userData: UserBase
        })
      } else {
        return res.status(400).json({
          responseCode: 400,
          responseDesc: 'INVALID RESPONSE',
          errorDesc: RESPONSE.FAILED
        })
      }
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        responseCode: 400,
        responseDesc: 'INVALID RESPONSE',
        errorDesc: err.response ? err.response.data : RESPONSE.FAILED
      })
    }
  }
})

router.get('detail-trasaction-dev', async (req, res) => {
  const { reference } = req.body
  const GetDetailTransaction = await call_payment.get(`/transaction/detail`, {
    reference
  })
  if (GetDetailTransaction.data.success === true) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: GetDetailTransaction.data.data
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})

router.get('/all-log-close/:user_id', async (req, res) => {
  const { user_id } = req.params
  const AllLogClose = await ClosePayModel.find({ user_id })
  console.log(AllLogClose)
  if (AllLogClose.length > 0) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: AllLogClose
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})

router.get('/all-log-open/:user_id', async (req, res) => {
  const { user_id } = req.params
  const AllLogOpen = await PaymentModels.find({ user_id })
  console.log(AllLogOpen)
  if (AllLogOpen.length > 0) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: AllLogOpen
    })
  } else {
    return res.status(400).json({
      responseCode: 400,
      responseDesc: 'INVALID RESPONSE',
      errorDesc: RESPONSE.FAILED
    })
  }
})

router.delete('/delete-log-close', async (req, res) => {
  const { id } = req.body
  const DeleteLogClose = await ClosePayModel.findByIdAndDelete(id)
  if (DeleteLogClose) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: DeleteLogClose
    })
  } else {
    return res.status(400).json({
      responseCode: RESPONSE._CODE_FILED,
      responseDesc: RESPONSE.FAILED,
      errorDesc: 'GAGAl DELETE'
    })
  }
})

router.delete('/delete-log-open', async (req, res) => {
  const { id } = req.body
  const DeleteLogOpen = await PaymentModels.findByIdAndDelete(id)
  if (DeleteLogOpen) {
    return res.status(200).json({
      responseCode: '00',
      responseDesc: 'SUCCESS',
      data: DeleteLogOpen
    })
  }
  else {
    return res.status(400).json({
      responseCode: RESPONSE._CODE_FILED,
      responseDesc: RESPONSE.FAILED,
      errorDesc: 'GAGAl DELETE'
    })
  }

})


/**
 * Callback Tripay
 */
router.post('/payment_callback', async (req, res) => {
  let json = req.body
  console.log(json)
  if (parseInt(json.is_closed_payment) === 1) {
    const AllLogClose = await ClosePayModel.findOneAndUpdate({ reference: json.reference }, {
      status: json.status,
      amount_received: json.amount_received,
      paid_at: json.paid_at,
      note: json.note,
    })
    let payload = {
      success: true,
      data: AllLogClose
    }
    let Third = await callback_payment.post(`/callback`, payload)

    if (Third.data.success === true) {
      return res.status(200).send({
        success: true
      })
    } else {
      return res.status(400).send({
        success: false
      })
    }

  } else {
    return res.status(400).send({
      success: false
    })
  }


})


module.exports = router;
