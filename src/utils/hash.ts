const { createHmac, scryptSync } = require("crypto");

function hmac(key: string, code: string): string {
  const hash: string = createHmac("sha256", key).update(code).digest();
  return hash;
}

function salt(value: string, key: string) {
  const salt = Number(key).toString(16);
  const hashValue = scryptSync(value, salt, 64).toString("hex");
  return hashValue;
}

export = { hmac, salt };
