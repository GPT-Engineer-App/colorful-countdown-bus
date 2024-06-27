import Papa from "papaparse";

export const parseGTFS = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};