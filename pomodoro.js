'use strict';
const notifier = require('node-notifier');
const cliProgress = require('cli-progress');
const getSettings = require('./input');
const TIME_FACTOR = 40;

async function pomodoroTecniqueMain(){
  try {
    const settings = await getSettings();
    const bars = initProgressBars(settings);
    const status = {
        cicles:0,
        working:true
    };
    const timeline = setInterval(() => {
        handleTime(timeline , settings, bars, status);
    }, TIME_FACTOR);
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
  } catch(error){
    throw error;
  }
}

function handleTime(timeline, settings, bars, status){
    try {
        if (bars.totalWorkBar.value < settings.totTime * 60) {
            return pomodoroTecnique(settings, bars, status);
        }
        bars.multibar.stop();
        clearInterval(timeline);
        setTimeout(notifyTaskComplete, 0);
    } catch (error) {
        throw error;
    } 
}

function pomodoroTecnique(settings, bars, status){
    try {
        if(status.working) {
            bars.workBar.increment();
            bars.totalWorkBar.increment();
            if(bars.workBar.value == bars.workBar.total){
                status.working = false;
                bars.workBar.update(0);
            }
            return;
        } else {
            const pauseTIme = status.cicles == settings.nCicles - 1? settings.longBreakTime : settings.shortBreakTime;
            bars.breakBar.increment();
            if(bars.breakBar.value == bars.breakBar.total){
                status.cicles = (status.cicles + 1) % settings.nCicles;
                status.working = true;
                if(status.cicles != settings.nCicles - 1){
                    bars.breakBar.stop();
                    bars.breakBar.start(settings.shortBreakTime, 0, {task:"Pausa corta\t"});
                } else {
                    bars.breakBar.stop();
                    bars.breakBar.start(settings.longBreakTime, 0, {task:"Pausa lunga\t"});
                }
            }
        }
    } catch(error) {
        throw error;
    }
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