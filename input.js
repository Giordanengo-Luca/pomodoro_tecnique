'use strict';
const inquirer = require('inquirer');

const integerRegex = /^\d+$/;
const questions = [
    {
      type: 'input',
      name: 'totTime',
      message: "Ore lavoro",
      default() {
        return "5";
      },
      validate(value) {
        if (value.match(integerRegex)) {
          return true;
        }
        return 'Valore non valido, il valore deve essere un numero intero';
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
        if (value.match(integerRegex)) {
          return true;
        }
        return 'Valore non valido, il valore deve essere un numero intero';
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
            if (value.match(integerRegex)) {
              return true;
            }
            return 'Valore non valido, il valore deve essere un numero intero';
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
            if (value.match(integerRegex)) {
              return true;
            }
            return 'Valore non valido, il valore deve essere un numero intero';
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
            if (value.match(integerRegex)) {
              return true;
            }
            return 'Valore non valido, il valore deve essere un numero intero';
          }
    },
  ];
  
const getSettings = () => {
    return new Promise((resolve, reject) => {
        inquirer
        .prompt(questions)
        .then((answers) => {
            resolve(answers);
        })
        .catch((error) => {
            reject(errror);
        });
    });
}


module.exports = getSettings;