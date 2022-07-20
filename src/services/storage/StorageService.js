const fs = require('fs');
const path = require('path');

class StorageService {
  #folder;

  constructor(folder) {
    this.#folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdir(folder, {reqursive: true})
    }
  }

  // method untuk membuat file baru ke dalam server
  writeFile(file, meta, nameId) {
    const fileExt = meta.filename.split('.').pop();

    const filename = `${nameId}.${fileExt}`;
    const path = `${this.#folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  // method untuk menghapus file dari server
  deleteFile(filename) {
    fs.unlinkSync(`${this.#folder}/${filename}`);
  }
}

module.exports = StorageService;
