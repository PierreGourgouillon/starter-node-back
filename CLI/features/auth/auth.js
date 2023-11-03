import FirebaseAuth from './firebase.js';
import JWT from './jwt.js';
import { getUserDTOCode } from "../../code/auth/auth.mjs"
import fs from "fs"
import LogAuth from './log.auth.js';

export default class Auth {
    constructor(parentPath, formattedCode, type) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
        this.type = type
    }

    async implement() {
        try {
            await new LogAuth(this.parentPath, this.formattedCode, this.type).create()
            await this.createUserDTO()
            if (this.type == "JWT") {
                await new JWT(this.parentPath, this.formattedCode).implement()
            }

            if (this.type == "Firebase auth") {
                await new FirebaseAuth(this.parentPath, this.formattedCode).implement()
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createUserDTO() {
        let dir = "dto"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(getUserDTOCode())
  
        fs.writeFile(this.parentPath + dir + "/user.dto.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the user.dto.js file");
            return;
          }
        });
    }
}