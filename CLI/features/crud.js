import fs from "fs"
import * as logger from "../logger.js"
import { getRouterCode } from "../code/crud/router.crud.js"
import { getControllerCode, getRequireAppCode, getAppUseCode } from "../code/crud/controller.crud.js"
import { getDataModelCode } from "../code/crud/model.crud.js"

export default class CRUD {
    constructor(parentPath, formattedCode, crudName, authType, isProtectRoute) {
        this.parentPath = parentPath
        this.formattedCode = formattedCode
        this.crudName = crudName
        this.authType = authType
        this.isProtectRoute = isProtectRoute
    }

    async create() {
        try {
            await this.createRouter()
            await this.createController()
            await this.createDataModel()
            await this.implementCrudInApp()
            logger.success("CRUD created")
        } catch (error) {
            console.log(error)
        }
    }

    async createRouter() {
        let dir = "routes"

        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }

        let code = getRouterCode()

        code = code.replace(/\{ROUTE_NAME\}/g, this.crudName)

        code = code.replace(/\{GET_METHOD_NAME\}/g,'"' + "/" + '"')
        code = this.replaceControllerInRoute(code, /\{GET_CONTROLLER\}/g, "get")

        code = code.replace(/\{POST_METHOD_NAME\}/g, '"' + "/" + '"')
        code = this.replaceControllerInRoute(code, /\{POST_CONTROLLER\}/g, "post")

        code = code.replace(/\{PUT_METHOD_NAME\}/g, '"' + "/" + '"')
        code = this.replaceControllerInRoute(code, /\{PUT_CONTROLLER\}/g, "put")

        code = code.replace(/\{DELETE_METHOD_NAME\}/g, '"' + "/" + '"')
        code = this.replaceControllerInRoute(code, /\{DELETE_CONTROLLER\}/g, "delete")

        const codeFormat = await this.formattedCode(code)
          
        fs.writeFile(this.parentPath + dir + `/${this.crudName}.routes.js`, codeFormat, 'utf8', (err) => {
            if (err) {
              logger.error(`Can't create the ${this.crudName}.routes.js file`);
              return;
            }
        });
    }

    replaceControllerInRoute(code, regex, method) {
        if (this.isProtectRoute) {
            if (this.authType == "JWT") {
                code = code.replace(/\{IMPORT_MIDDLEWARE\}/g, 'const jwtAuthentication = require("../middlewares/jwt.middleware.js")')
                return code.replace(regex, `jwtAuthentication, controller.${method}${this.capitalize(this.crudName)}`)
            }

            if (this.authType == "Firebase auth"){
                code = code.replace(/\{IMPORT_MIDDLEWARE\}/g, 'const firebaseMiddleware = require("../middlewares/firebase.middleware.js")')
                return code.replace(regex, `firebaseMiddleware, controller.${method}${this.capitalize(this.crudName)}`)
            }
        }
        code = code.replace(/\{IMPORT_MIDDLEWARE\}/g, "")
        return code.replace(regex, `controller.${method}${this.capitalize(this.crudName)}`)
    }

    async createController() {
        let dir = "controllers"

        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }

        let code = getControllerCode()
        code = code.replace(/\{ROUTE_NAME_CODE\}/g, this.capitalize(this.crudName))
        code = code.replace(/\{ROUTE_NAME\}/g, this.lowerCase(this.crudName))
        code = code.replace(/\{GET_CONTROLLER_NAME\}/g, `controller.get${this.capitalize(this.crudName)}`)
        code = code.replace(/\{POST_CONTROLLER_NAME\}/g, `controller.post${this.capitalize(this.crudName)}`)
        code = code.replace(/\{PUT_CONTROLLER_NAME\}/g, `controller.put${this.capitalize(this.crudName)}`)
        code = code.replace(/\{DELETE_CONTROLLER_NAME\}/g, `controller.delete${this.capitalize(this.crudName)}`)

        let codeFormat = await this.formattedCode(code)

        fs.writeFile(this.parentPath + dir + `/${this.crudName}.controller.js`, codeFormat, 'utf8', (err) => {
            if (err) {
                logger.error(`Can't create the ${this.crudName}.controller.js file`);
                return;
            }
        });
    }

    async createDataModel() {
        const dir = "models"

        if (!fs.existsSync(this.parentPath + dir)) {
            fs.mkdirSync(this.parentPath + dir);
        }

        let code = getDataModelCode()

        code = code.replace(/\{MODEL_NAME\}/g, this.lowerCase(this.crudName))
        code = code.replace(/\{MODEL_NAME_PROJECT\}/g, this.capitalize(this.crudName))

        let codeFormat = await this.formattedCode(code)

        fs.writeFile(this.parentPath + dir + `/${this.crudName}.model.js`, codeFormat, 'utf8', (err) => {
            if (err) {
                logger.error(`Can't create the ${this.crudName}.model.js file`);
                return;
            }
        });
    }

    async implementCrudInApp() {
        let appRequireCode = await this.formattedCode(getRequireAppCode().replace(/\{ROUTE_NAME\}/g, this.lowerCase(this.crudName)))
        let appUseCode = await this.formattedCode(getAppUseCode().replace(/\{ROUTE_NAME\}/g, this.lowerCase(this.crudName)))

        fs.readFile(this.parentPath + "app.js", 'utf-8', (err, data) => {
            if (err) {
              logger.error("Can't find the package.json file");
              return;
            }
            var code = data.replace("module.exports = app;", appUseCode + "\n module.exports = app;");
            code = code.replace("const app = express();", appRequireCode + "$&")

            this.formattedCode(code)
            .then((codeFormatted) => {
                fs.writeFile(this.parentPath + "app.js", codeFormatted, 'utf-8', (err) => {
                    if (err) {
                      logger.error("Can't write int the package.json file");
                      return;
                    }
                  }
                );
            })
          }
        );
    }

    async getMethod() {
    }

    async postMethod() {

    }

    async putMethod() {

    }

    async deleteMethod() {

    }

    capitalize(value) {
        return value[0].toUpperCase() + value.slice(1);
    }

    lowerCase(value) {
        return value[0].toLowerCase() + value.slice(1);
    }
}