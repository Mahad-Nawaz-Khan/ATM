#! /usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
let balance = 30000;
const pin = 3245;
const user_id = 'maog';
let stop = false;
// Delay funtion to make it not so quick
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to convert a string to title case
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
// When they want to exit the program
async function exitProgram() {
    await delay(500);
    console.log('\nThank You for Choosing Mahad Banking :)');
    await delay(500);
    process.stdout.write('Exiting');
    for (let i = 0; i < 3; i++) {
        await delay(200);
        process.stdout.write('.');
    }
    console.log('\n');
    stop = true;
}
// Function to prompt user if they want to perform another transaction
async function promptAgain() {
    await delay(500);
    const { confirm } = await inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: 'Would you like to make another transaction?',
        choices: ['Yes', 'No'],
        prefix: chalk.blueBright('\n!')
    });
    if (confirm == 'No') {
        await exitProgram();
    }
}
// Function to prompt user for deposit amount and update balance
async function deposit() {
    await delay(200);
    const { amount } = await inquirer.prompt({
        type: 'input',
        name: 'amount',
        message: 'How much would you like to deposit?',
        prefix: chalk.blueBright('\n$'),
        validate: (input) => isNaN(Number(input)) ? chalk.red("Please enter a valid number.") : true
    });
    balance += Number(amount);
    await delay(200);
    console.log(`  ${chalk.whiteBright('Your new balance is')} ${chalk.greenBright(balance)}`);
}
// Function to prompt user for withdraw amount and update balance if sufficient funds
async function withdraw() {
    await delay(500);
    const { amount } = await inquirer.prompt({
        type: 'input',
        name: 'amount',
        message: 'How much would you like to withdraw?',
        prefix: chalk.blueBright('\n$'),
        validate: (input) => {
            if (isNaN(Number(input))) {
                return chalk.red('Please enter a valid number.');
            }
            else if (balance < Number(input)) {
                return chalk.red('Insufficient Funds');
            }
            else {
                return true;
            }
        }
    });
    balance -= Number(amount);
    await delay(200);
    console.log(`  ${chalk.whiteBright('Your new balance is')} ${chalk.redBright(balance)}`);
}
// Function to handle user actions
async function handleUserActions() {
    while (!stop) {
        await delay(1000);
        const { option } = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['Deposit', 'Withdraw', 'Exit'],
            prefix: chalk.blueBright('\n>'),
            loop: false,
        });
        switch (option) {
            case 'Deposit':
                await deposit();
                await promptAgain();
                break;
            case 'Withdraw':
                await withdraw();
                await promptAgain();
                break;
            case 'Exit':
                await exitProgram();
                break;
            default:
                console.log(chalk.red('Invalid Option'));
                break;
        }
    }
}
// Function to display a welcome message
function displayWelcomeMessage() {
    console.log(chalk.blueBright(`
    *****************************************
    *                                       *
    *     ${chalk.whiteBright('Welcome to Mahad Bank Limited')}     *
    *                                       *
    *****************************************
    `));
}
// Function to validate user ID and pin
async function validateUser() {
    while (true) {
        const userIdInput = await inquirer.prompt([
            {
                type: 'input',
                name: 'user_id',
                message: 'Input a valid User Id',
                prefix: chalk.green('\n?')
            },
            {
                type: 'password',
                name: 'pin',
                message: 'Input a valid Pin',
                prefix: chalk.green('\n?'),
                mask: '*'
            }
        ]);
        if (userIdInput.user_id === user_id && parseInt(userIdInput.pin) === pin) {
            await delay(500);
            console.log(chalk.bold('\nWelcome '), chalk.cyanBright(toTitleCase(userIdInput.user_id)));
            console.log(`${chalk.whiteBright('Your balance is')} ${chalk.yellow(balance)}\n`);
            await handleUserActions();
            break;
        }
        else {
            await delay(500);
            console.log(chalk.red('Invalid User ID or Pin'));
            console.log(chalk.yellow('\nPlease try again'));
        }
    }
}
// Start the application by displaying the welcome message and validating the user
displayWelcomeMessage();
await delay(300);
validateUser();
