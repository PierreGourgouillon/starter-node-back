import fs from "fs"
import * as logger from "../../logger.js"
import { getJWTMiddlewareCode } from "../../code/auth/auth.mjs"

export default class JWT {
    constructor(parentPath, formattedCode) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
    }

    async implement() {
        try {
            await this.createMiddleware()
            logger.success('JWT auth feature is available');
        } catch (error) {
            logger.error("JWT auth feature is not available")
        }   
    }

    async createMiddleware() {
        let dir = "middlewares"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(getJWTMiddlewareCode())
  
        fs.writeFile(this.parentPath + dir + "/jwt.middleware.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the jwt.middleware.js file");
            return;
          }  
        });
    }
}