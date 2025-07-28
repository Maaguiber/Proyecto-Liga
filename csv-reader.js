const fs = require("fs/promises");

/**
 * Reads a CSV file from the given path and parses its content.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of objects representing the CSV data.
 */
async function readCSV(filePath) {
  try {
    // Read the file content
    const data = await fs.readFile(filePath, "utf8");

    // Split the content into lines
    const lines = data.split("\n").filter((line) => line.trim());

    // Extract headers from the first line
    const headers = lines[0].split(",").map((header) => header.trim());

    // Parse the remaining lines as objects
    const result = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return result;
  } catch (error) {
    console.error("Error reading the CSV file:", error.message);
    throw new Error("Could not read or parse the CSV file.");
  }
}

module.exports = readCSV;