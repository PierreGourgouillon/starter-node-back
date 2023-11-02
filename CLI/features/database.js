import fs from "fs"
import * as logger from "../logger.js"
import { mongodbConnection, mongodbRequire } from "../code/database.mjs"

export default class Database {
    constructor(parentPath, formattedCode, type) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
        this.type = type
    }

    async implement() {
        try {
            if (this.type == "mongodb") {
                await this.createMongodbConnection()
                logger.success('Mongodb database is available');
            }
        } catch (error) {
            
        }
    }

    async createMongodbConnection() {
        let dir = "database"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(mongodbConnection())
  
        fs.writeFile(this.parentPath + dir + "/mongodb.init.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the mongodb.init.js file");
            return;
          }  
        });

        fs.readFile(this.parentPath + "/app.js", "utf-8", (err, data) => {
            if (err) {
                logger.error("Can't find the app.js file");
                return;
            }

            var newValue = data.replace(/const app = express\(\);/, mongodbRequire() + "$&" + "\n connectionMongoDB();");

            this.formattedCode(newValue)
            .then((codeFormat) => {
                fs.writeFile(this.parentPath + "/app.js", codeFormat, 'utf8', (err) => {
                    if (err) {
                      logger.error("Can't create the mongodb.init.js file");
                      return;
                    }  
                });
            })
        })
    }
}