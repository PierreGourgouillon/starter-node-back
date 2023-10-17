import inquirer from 'inquirer';
import fs from "fs"

(async () => {
  try {
    const answers = await getAnswers();
    editPackageName(answers.packageName)
    // console.log('The answers are: ', answers);
  } catch (err) {
    console.error(`There was an error while talking to the API: ${err.message}`, err);
  }
})();

function getAnswers() {
  return inquirer.prompt([
    {
        name: 'packageName',
        message: 'What is your package name ?',
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
    name: 'options',
    message: 'What would you like to guess for the given first name?',
    type: 'checkbox',
    choices: ['gender', 'nationality'],
    validate: (options) => {
      if (!options.length) {
        return 'Choose at least one of the above, use space to choose the option'
      }

      return true;
    }
  }]);
}

function editPackageName(packageName) {
    fs.readFile("../package.json", 'utf-8', function(err, data){
        if (err) throw err;

        var newValue = data.replace(/\{PACKAGE_NAME\}/g,'"' + packageName + '"');
    
        fs.writeFile("../package.json", newValue, 'utf-8', function (err) {
          if (err) throw err;
          console.log('filelistAsync complete' + newValue);
        });
    });
}