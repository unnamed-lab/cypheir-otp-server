const { createHmac } = require("crypto");

function hmac(key: string, code: string): string {
  const hash: string = createHmac("sha256", key).update(code).digest();
  return hash;
}

export = { hmac };