import { promises as fs } from 'fs';
import * as logger from "../../logger.js";
import { getLogRouterCode } from "../../code/crud/router.crud.js";
import { getLogControllerCode, getRequireLogAppCode, getAppLogUseCode } from "../../code/crud/controller.crud.js";
import { getUserModelCode } from "../../code/crud/model.crud.js";

export default class LogAuth {
    constructor(parentPath, formattedCode, authType) {
        this.parentPath = parentPath;
        this.formattedCode = formattedCode;
        this.authType = authType;
    }

    async create() {
        try {
            await this.createRouter();
            await this.createController();
            await this.createUserModel()
            await this.implementLogInApp();
            logger.success("Auth created");
        } catch (error) {
            console.log(error);
        }
    }

    async createRouter() {
        const dir = "routes";

        try {
            await fs.promises.access(this.parentPath + dir, fs.constants.F_OK);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Le répertoire n'existe pas, donc nous le créons
                await fs.promises.mkdir(this.parentPath + dir);
            }
        }    

        let code = getLogRouterCode();

        if (this.authType == "Firebase auth") {
            code = code.replace(/\{MIDDLEWARE_VARIABLE\}/g, 'const middlewareAuth = require("../middlewares/firebase.middleware")')
            code = code.replace(/\{REGISTER_CONTROLLER\}/g, 'middlewareAuth, controller.register')
            code = code.replace(/\{LOGIN_CONTROLLER\}/g, 'middlewareAuth, controller.login')
        } else {
            code = code.replace(/\{MIDDLEWARE_VARIABLE\}/g, '')
            code = code.replace(/\{REGISTER_CONTROLLER\}/g, 'controller.register')
            code = code.replace(/\{LOGIN_CONTROLLER\}/g, 'controller.login')
        }

        const codeFormat = await this.formattedCode(code);
        await fs.writeFile(this.parentPath + dir + `/auth.routes.js`, codeFormat, 'utf8');
    }

    async createController() {
        const dir = "controllers";

        try {
            await fs.promises.access(this.parentPath + dir, fs.constants.F_OK);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Le répertoire n'existe pas, donc nous le créons
                await fs.promises.mkdir(this.parentPath + dir);
            }
        }

        let code = getLogControllerCode();
        if (this.authType == "JWT") {
            code = code.replace(/\{CRYPTO_VARIABLE\}/g, 'const crypto = require("crypto")')
            code = code.replace(/\{GET_USERID_CODE\}/g, 'crypto.randomUUID().toString()')
        } else {
            code = code.replace(/\{CRYPTO_VARIABLE\}/g, '')
            code = code.replace(/\{GET_USERID_CODE\}/g, 'req.user.userId')
        }

        let codeFormat = await this.formattedCode(code);

        await fs.writeFile(this.parentPath + dir + `/auth.controller.js`, codeFormat, 'utf8');
    }

    async createUserModel() {
        const dir = "models";

        try {
            await fs.promises.access(this.parentPath + dir, fs.constants.F_OK);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Le répertoire n'existe pas, donc nous le créons
                await fs.promises.mkdir(this.parentPath + dir);
            }
        }

        let code = getUserModelCode();
        let codeFormat = await this.formattedCode(code);

        await fs.writeFile(this.parentPath + dir + `/user.model.js`, codeFormat, 'utf8');
    }

    async implementLogInApp() {
        try {
            const appRequireCode = await this.formattedCode(getRequireLogAppCode());
            const appUseCode = await this.formattedCode(getAppLogUseCode());

            const data = await fs.readFile(this.parentPath + 'app.js', 'utf-8');
            let code = data.replace('module.exports = app;', `${appUseCode}\n module.exports = app;`);
            code = code.replace('const app = express();', `${appRequireCode}$&`);

            const codeFormatted = await this.formattedCode(code);
            await fs.writeFile(this.parentPath + 'app.js', codeFormatted, 'utf-8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                logger.error("Can't find the app.js file");
            } else {
                logger.error("An error occurred:", err);
            }
        }
    }
}