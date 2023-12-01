// fileUtils.js
import fs from 'fs/promises';

export const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.log(`Error al leer el archivo ${filePath}: ${error.message}`);
    throw new Error(`Error al leer el archivo ${filePath}.`);
  }
};

export const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, data, 'utf8');
  } catch (error) {
    console.log(`Error al escribir en el archivo ${filePath}: ${error.message}`);
    throw new Error(`Error al escribir en el archivo ${filePath}.`);
  }
};
