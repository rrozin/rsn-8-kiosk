import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateCurrentPage = page => fs.writeFileSync(`${__dirname}/../static-files/current-page.txt`, page, 'UTF-8');
const getCurrentPage = () => fs.readFileSync(`${__dirname}/../static-files/current-page.txt`, 'UTF-8');

export { updateCurrentPage, getCurrentPage };