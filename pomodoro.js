'use strict';
const notifier = require('node-notifier');
const cliProgress = require('cli-progress');
const getSettings = require('./input');
const TIME_FACTOR = 40;

async function pomodoroTecniqueMain(){
  try {
    const settings = await getSettings();
    const bars = initProgressBars(settings);
    await pomodoroTecnique(settings, bars);
    notifyTaskComplete();
  } catch (error) {
    console.log(error);
  }
}

function initProgressBars(settings){
  try {
    const multibar = new cliProgress.MultiBar({
      clearOnComplete: false,
      hideCursor: true,
      format: '{task} [{bar}] {percentage}% | {value}/{total}'

    }, cliProgress.Presets.shades_grey);
    const totalWorkBar = multibar.create(settings.totTime * 60, 0, {task:"Lavoro totale\t"});
    const workBar = multibar.create(settings.workTime, 0, {task:"Sessione lavoro\t"});
    const breakBar = multibar.create(settings.shortBreakTime, 0, {task:"Pausa corta\t"});
    return {multibar, totalWorkBar, workBar, breakBar};
  } catch (error) {
    throw(error);
  }
}

async function pomodoroTecnique(settings, bars){
  try {
    let cicles = 0;
    for(let totTime = 0; totTime < settings.totTime * 60;){
      await simulateProgress(settings.workTime,
      incr => {
        bars.workBar.increment(incr);
        bars.totalWorkBar.increment(incr);
        totTime+=incr;
      },
      () => totTime == settings.totTime * 60,
      () => {bars.workBar.update(0);});

      if(totTime == settings.totTime * 60)
          break;
      
      await simulateProgress(cicles == settings.nCicles - 1? settings.longBreakTime : settings.shortBreakTime, incr => {
        bars.breakBar.increment(incr);
      }, () => false,
      () => {
        cicles = (cicles + 1) % settings.nCicles;
      if(cicles != settings.nCicles - 1){
        bars.breakBar.stop();
        bars.breakBar.start(settings.shortBreakTime, 0, {task:"Pausa corta\t"});
      } else {
        bars.breakBar.stop();
        bars.breakBar.start(settings.longBreakTime, 0, {task:"Pausa lunga\t"});
      }
      });
    }
    bars.multibar.stop();
  } catch(error) {
    throw error;
  }
}

async function simulateProgress(totTime, body, exitCond = () => false, finalOperation = () => {}, timeUnit = 1){
  try {
    for(let time = 0; time < totTime && !exitCond(); time+= timeUnit){
      body(timeUnit);
      await sleep(timeUnit * TIME_FACTOR);
    }
    finalOperation();
  } catch (error) {
    throw error;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function notifyTaskComplete(){
  try {
    notifier.notify({
      title: 'Pomodoro Tecnique',
      message: 'Lavoro completato',
      icon: './img/pomodoroTecnique.PNG'
    });
  } catch (error) {
    throw error;
  }
}

pomodoroTecniqueMain();