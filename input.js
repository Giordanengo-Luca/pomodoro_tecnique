'use strict';
const inquirer = require('inquirer');

const parseInt = value => {
    if (value.match(/^\d+$/)) {
      return true;
    }
    return 'Valore non valido, il valore deve essere un numero intero';
};
const questions = [
    {
      type: 'input',
      name: 'totTime',
      message: "Ore lavoro",
      default() {
        return "5";
      },
      validate(value) {
        return parseInt(value);
      }
    },
    {
      type: 'input',
      name: 'workTime',
      message: "Durata sessione lavoro",
      default() {
        return "25";
      },
      validate(value) {
        return parseInt(value);
      }
    },
    {
        type: 'input',
        name: 'shortBreakTime',
        message: "Durata pausa breve",
        default() {
          return "5";
        },
        validate(value) {
          return parseInt(value);
        }
    },
    {
        type: 'input',
        name: 'longBreakTime',
        message: "Durata pausa lunga",
        default() {
          return "15";
        },
        validate(value) {
          return parseInt(value);
        }
    },
    {
        type: 'input',
        name: 'nCicles',
        message: "Cicli per pausa lunga",
        default() {
          return "4";
        },
        validate(value) {
          return parseInt(value);
        }
    },
  ];
  
const getSettings = async () => {
  try {
    const answers = await inquirer.prompt(questions)
    return answers;
  } catch (error) {
    throw error;
  }
}


module.exports = getSettings;