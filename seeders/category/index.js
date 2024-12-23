import importCategoriesFromExcel from "./category_insertion.js";

export const syncDatabase = async ()=>{
    importCategoriesFromExcel();
}