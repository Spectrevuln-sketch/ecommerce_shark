exports.PAYMENT = {
  TRIPAY_SENDBOX: 'https://tripay.co.id/api-sandbox',
  TRIPAY_PRODUCTION: 'https://tripay.co.id/api',
  API_KEY_SENDBOX: 'DEV-PHiF8O2ADajNmgNdgmarFVPY9zFT6x3D9JWoM34h',
  PRIVATE_SENDBOX: 'mYPA0-Ovk7s-TX8Ow-UjXor-QaI5M',
  KODE_MERCHANT: 'T5382'
}

exports.INV = {
  // SHARK86: `SHARK86${new Date().getHours + new Date().getMinutes + new Date().getSeconds}`,
  SHARK86: `INV86210422`,
}

exports.PRIVATE = {
  KEY_SHARK86: 'kUcsEVQL9V6iCQ9WrZwqnb9Dk5RiP9oy+dgmv1o09NI='
}


exports.ORIGIN_ALLOW = {
  // FRONTEND
  ORIGIN_CLIENT1: 'http://localhost:3000',
  // BACKEND
  // ORIGIN_CLIENT2: 'http://localhost:8557/checkoutApi',
  ORIGIN_CLIENT2: 'https://api.shark86.com/checkoutApi',
}



exports.RESPONSE = {
  _CODE_SUCCESS: '00',
  _CODE_FILED: '01',
  SUCCESS: 'BERHASIL DIPROSES',
  FAILED: 'GAGAL DIPROSES'
}
