import inquirer from 'inquirer';
import fs from "fs"
import prettier from 'prettier'
import * as logger from "./logger.js"
import Database from './features/database.js';
import { exit } from 'process';
import Auth from './features/auth/auth.js';
import CRUD from './features/crud.js';

(async () => {
  try {
    let menuResponse = await menu()
    const answers = await getAnswers(menuResponse);

    if (menuResponse.menuChoice == "Create a new package") {
      editPackageName(answers.packageName)
      await new Auth(getParentFolderPath(), formattedCode, answers.auth).implement()
      await new Database(getParentFolderPath(), formattedCode, answers.database).implement()
    }

    if (menuResponse.menuChoice == "Modify an existing package") {
      if (answers.modifyExistingPackageOption == "Create a CRUD") {
        let crudAnswer = await getCRUDAnswer()
        let auth = crudAnswer.isProtectRoutes ? await inquirer.prompt([{
          name: 'auth',
          message: 'Select a auth:',
          type: 'list',
          choices: [
            'JWT',
            'Firebase auth'
          ],
        }]) : ""
        await new CRUD(getParentFolderPath(), formattedCode, crudAnswer.crudName, auth.auth, crudAnswer.isProtectRoutes).create()
      }
    }
    // console.log('The answers are: ', answers);
  } catch (err) {
    logger.error("Unknown error");
  }
})();

async function menu() {
  return await inquirer.prompt([
    {
      name: 'menuChoice',
      message: 'Select an option:',
      type: 'list',
      choices: [
        'Create a new package',
        'Modify an existing package',
        'Exit'
      ],
    }
  ]);
}

async function getAnswers(menuResponse) {
  if (menuResponse.menuChoice === 'Create a new package') {
    return await inquirer.prompt([
      {
        name: 'packageName',
        message: 'What is your package name?',
        type: 'input',
        validate: (packageName) => {
          if(!packageName.length) {
            return 'Please provide a package name';
          }

          if(packageName.length <= 3 || packageName.length > 20) {
            return 'Please provide a package name between 4 and 20 characters long';
          }

          return true;
        },
        filter: (packageName) => {
          return packageName.trim();
        }
      },
      {
        name: 'auth',
        message: 'Select a auth:',
        type: 'list',
        choices: [
          'JWT',
          'Firebase auth'
        ],
      },
      {
        name: 'database',
        message: 'Select a database:',
        type: 'list',
        choices: [
          'mongodb'
        ],
      }
    ]);
  } else if (menuResponse.menuChoice === 'Modify an existing package') {
    return await inquirer.prompt([
      {
        name: 'modifyExistingPackageOption',
        message: 'Select an option:',
        type: 'list',
        choices: [
          'Create a CRUD'
        ],
      }
    ]);
  } else {
    console.log('Exiting the application');
    exit(0)
  }
}

async function getCRUDAnswer() {
  return await inquirer.prompt([
    {
      name: 'crudName',
      message: 'What is the name of the CRUD ?',
      type: 'input',
      validate: (packageName) => {
        if(!packageName.length) {
          return 'Please provide a package name';
        }

        if(packageName.length <= 3 || packageName.length > 20) {
          return 'Please provide a package name between 4 and 20 characters long';
        }

        return true;
      },
      filter: (packageName) => {
        return packageName.trim();
      }
    },
    {
      name: "isProtectRoutes",
      message: "Do you want to protect the routes ?",
      type: "confirm"
    },
  ])
}

function editPackageName(packageName) {
  fs.readFile(getParentFolderPath() + "package.json", 'utf-8', (err, data) => {
      if (err) {
        logger.error("Can't find the package.json file");
        return;
      }
      var newValue = data.replace(/\{PACKAGE_NAME\}/g,'"' + packageName + '"');
  
      fs.writeFile(getParentFolderPath() + "package.json", newValue, 'utf-8', (err) => {
          if (err) {
            logger.error("Can't write int the package.json file");
            return;
          }
          logger.success('Package name edited')
        }
      );
    }
  );
}

async function formattedCode(code) {
  return await prettier.format(code, {
    parser: 'babel',
    singleQuote: true,
    semi: true,
    trailingComma: 'es5',
  });
}

function getParentFolderPath() {
  const currentModuleUrl = import.meta.url;
  const url = new URL(currentModuleUrl);
  return url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1) + "../";
}