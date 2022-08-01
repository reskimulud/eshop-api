const imageUrlGenerator = (filename) => {
  const host = process.env.HOST;
  const port = process.env.PORT;

  if (port == 443) {
    return `https://${host}/products/image/${filename}`;
  }

  return `http://${host}:${port}/products/image/${filename}`;
}

module.exports = { imageUrlGenerator };
