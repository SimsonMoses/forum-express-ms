import xlsx from 'xlsx';
import db from '../../models/index.js';
import path from 'path';
import url from 'url';
import fs from 'fs/promises';

const importCategoriesFromExcel = async () => {
    console.log('Importing Categories');
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.resolve('./forum.xlsx');
    try {
        let forumxlsxPath = path.resolve(__dirname, 'forum.xlsx');
        console.log(forumxlsxPath);
        const workbook = xlsx.readFile(forumxlsxPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const categoriesData = xlsx.utils.sheet_to_json(sheet);

        const categories = categoriesData.map(row => ({
            name: row.value,
        }))

        await db.Category.bulkCreate(categories);
    } catch (error) {
        console.error('Error importing categories:', error);
    }
}


export default importCategoriesFromExcel;