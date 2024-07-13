import fs from "fs";
import * as csv from "csv";

// File path: "./test/example_people.csv"

const readCSVFile = async (file: string): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(file, {
      encoding: "utf8",
    }); // Reads local files
    const csvArr: [][] = [];

    readStream
      .pipe(
        csv.parse((err, data) => {
          if (err) console.error(err);
          else {
            const output: [][] = data;
            return output;
          }
        })
      )
      .on("data", data => {
        csvArr.push(data);
      })
      .on("end", () => resolve(csvArr))
      .on("error", error => reject(error));
  });
};

const renderCSV = async (file: string): Promise<any> => {
  try {
    const csv = await readCSVFile(file);
    return csv;
  } catch (error) {
    console.error(error);
  }
};

export { renderCSV };
