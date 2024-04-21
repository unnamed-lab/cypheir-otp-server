const credValidator = (key1: string, key2: string, callback: any) => {
  try {
    if (!key1 || !key2) throw new Error("Please provide two keys.");
    const isValid: boolean = key1 === key2;

    if (typeof callback !== "function")
      throw new Error("No callback function.");

    if (!isValid) console.error("Keys do not match.");
    return callback();
  } catch (error) {
    throw new Error("Validator parameter error: " + error);
  }
};

export { credValidator };
