'use strict';
const notifier = require('node-notifier');
const cliProgress = require('cli-progress');
const getSettings = require('./input');

async function pomodoro(){
  const settings = await getSettings();

  const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '{task} [{bar}] {percentage}% | {value}/{total}'

  }, cliProgress.Presets.shades_grey);
  const totalWorkBar = multibar.create(settings.totTime * 60, 0, {task:"Lavoro totale\t"});
  const workBar = multibar.create(settings.workTime, 0, {task:"Sessione lavoro\t"});
  const breakBar = multibar.create(settings.shortBreakTime, 0, {task:"Pausa corta\t"});


  let cicles = 0;
  for(let totTime = 0; totTime < settings.totTime * 60;){
    //simula sessione lavoro
    await simulateProgress(settings.workTime, incr => {
      workBar.increment(incr);
      totalWorkBar.increment(incr);
      totTime+=incr;
    }, () => totTime == settings.totTime * 60);
    if(totTime == settings.totTime * 60)
        break;
    //resetta sessione lavoro
    workBar.update(0);
    //esegui pausa
    await simulateProgress(cicles == settings.nCicles - 1? settings.longBreakTime : settings.shortBreakTime, incr => {
      breakBar.increment(incr);
    });
    //resetta pausa
    cicles = (cicles + 1) % settings.nCicles;
    if(cicles != settings.nCicles - 1){
      breakBar.stop();
      breakBar.start(settings.shortBreakTime, 0, {task:"Pausa corta\t"});
    } else {
      breakBar.stop();
      breakBar.start(settings.longBreakTime, 0, {task:"Pausa lunga\t"});
    }
  }
  multibar.stop();


  notifier.notify({
    title: 'Pomodoro Tecnique',
    message: 'Lavoro completato',
    icon: './img/pomodoroTecnique.PNG'
  });
}

async function simulateProgress(totTime, body, exitCond = () => false, timeUnit = 1){
  const TIME_FACTOR = 40;
  for(let time = 0; time < totTime; time+= timeUnit){
    body(timeUnit);
    await sleep(timeUnit * TIME_FACTOR);
    if(exitCond()) return;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

pomodoro();