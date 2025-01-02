const QRCode = require('qrcode');
const path = require('path');

const createQRCode = async (uniqueCode, directory) => {
  const qrCodeFilePath = path.join(directory, `qrcode_${uniqueCode}.png`);
  await QRCode.toFile(qrCodeFilePath, uniqueCode, {
    color: { dark: "#000000", light: '#fafafa' },
    width: 300,
  });
  return qrCodeFilePath;
};
module.exports = createQRCode;
