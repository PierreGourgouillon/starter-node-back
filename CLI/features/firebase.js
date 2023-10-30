import fs from "fs"
import * as logger from "../logger.js"
import { getFirebaseAuthCode, getFirebaseAuthDTOCode, getFirebaseAuthMiddleWareCode } from "../code.mjs"

export default class FirebaseAuth {
    constructor(parentPath, formattedCode) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
    }

    async implement() {
        try {
            await this.initFirebase()
            await this.createDTO()
            await this.createFirebaseMiddleware()
            logger.success('Firebase auth feature is available');
            logger.info("You need to implement the firebase middleware inside a routes folder like this \n\n const firebaseMiddleware = require('../middlewares/firebase') \n router.get(\"/\", firebaseMiddleware, controller)")
        } catch (error) {
            logger.error("Firebase auth feature is not available")
        }
    }

    async initFirebase() {
        let dir = "firebase"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(getFirebaseAuthCode())
  
        fs.writeFile(this.parentPath + dir + "/firebase.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the firebase.js file");
            return;
          }  
        });
    }

    async createDTO() {
        let dir = "dto"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(getFirebaseAuthDTOCode())
  
        fs.writeFile(this.parentPath + dir + "/firebaseDTO.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the firebaseDTO.js file");
            return;
          }
        });
    }

    async createFirebaseMiddleware() {
        let dir = "middlewares"
    
        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }
  
        const codeFormat = await this.formattedCode(getFirebaseAuthMiddleWareCode())
  
        fs.writeFile(this.parentPath + dir + "/firebase.js", codeFormat, 'utf8', (err) => {
          if (err) {
            logger.error("Can't create the firebase.js file");
            return;
          }
        });
    }
}