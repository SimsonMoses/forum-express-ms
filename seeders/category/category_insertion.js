import xlsx from 'xlsx';
import db from '../../models/index.js';
import path from 'path';
import url from 'url';
import { Sequelize } from 'sequelize';

const importCategoriesFromExcel = async () => {
    console.log('Importing Categories');
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    // const filePath = path.resolve('./forum.xlsx');
    try {
        let forumxlsxPath = path.resolve(__dirname, 'forum.xlsx');
        console.log(forumxlsxPath);
        const workbook = xlsx.readFile(forumxlsxPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const categoriesData = xlsx.utils.sheet_to_json(sheet);
        const newCategoriesName = categoriesData.map(row => row.value);
        
        const Op = Sequelize.Op;
        let categories = await db.Category.findAll({
            where: {
                name:{
                    [Op.in]: newCategoriesName
                }
            },
            attributes: ['name']
        });
        let categoriesNames = categories.map(category => category.name);
        let newcategories = categoriesData.filter(category => !categoriesNames.includes(category.value)).map(category=>({name: category.value}));
        if(newcategories.length != 0){
            await db.Category.bulkCreate(newcategories);
            console.log('Categories Imported');
        }
    } catch (error) {
        console.error('Error importing categories:', error);
    }
}


export default importCategoriesFromExcel;