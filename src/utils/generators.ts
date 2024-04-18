const { createHmac } = require("crypto");
const { hmac } = require("../utils/hash");

const HOTP = (key: string, counter: number, digits: number = 6): string => {
  const secretKey = Buffer.from(key);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter), 0);

  const hmacDigest = hmac(secretKey, counterBuffer);

  const offset = hmacDigest[hmacDigest.length - 1] & 0x0f;
  const binaryCode = hmacDigest.slice(offset, offset + 4);
  const dynamicValue = binaryCode.readUInt32BE() & 0x7fffffff;

  const otp = dynamicValue % 10 ** digits;

  return otp.toString().padStart(digits, "0");
};

export = { HOTP };
