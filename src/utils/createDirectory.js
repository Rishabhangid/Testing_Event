const fs = require('fs');
const path = require('path');

const createDirectory = async (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
};

module.exports = createDirectory;
