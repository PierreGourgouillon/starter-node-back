import chalk from 'chalk';

export function success(message) {
    console.log(chalk.bgBlue(chalk.white("CLI SUCCESS")) + " " + chalk.green(message))
}

export function info(message) {
    console.log(chalk.bgYellow(chalk.white("CLI INFO")) + " " + message)
    console.log()
}

export function error(message) {
    console.log(chalk.bgBlue(chalk.white("CLI ERROR")) + " " + chalk.red(message))
}