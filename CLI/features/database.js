import fs from "fs"
import * as logger from "../logger.js"
import { mongodbConnection } from "../code/database.mjs"

export default class Database {
    constructor(parentPath, formattedCode, type) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
        this.type = type
    }

    async implement() {
        try {
            if (this.type == "mongodb") {
                await this.mongodb()
                logger.success('Mongodb database is available');
            }
        } catch (error) {
            
        }
    }

    async mongodb() {
        let dir = "database"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(mongodbConnection())
  
        fs.writeFile(this.parentPath + dir + "/mongodb.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the mongodb.js file");
            return;
          }  
        });
    }
}