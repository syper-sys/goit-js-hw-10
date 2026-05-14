import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const input = document.querySelector('#datetime-picker')
const startBtn = document.querySelector('[data-start]')
const timeValues = document.querySelectorAll('[data-days], [data-hours], [data-minutes], [data-seconds]')
let userSelectedDate = null;
let intervalId = null;
startBtn.disabled = true;
input.disabled = false;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate < new Date()) {
            iziToast.error({
                message: 'Please choose a date in the future',
            });
            startBtn.disabled = true;
        } else {
            startBtn.disabled = false;
        }
    },
};

flatpickr(input, options)

startBtn.addEventListener('click', () => {
    input.disabled = true;
    startBtn.disabled = true;
    intervalId = setInterval(() => {
        const currentTime = new Date();
        const diff = userSelectedDate - currentTime;
        const timeStr = convertMs(diff);
        timeValues[0].textContent = timeStr.days;
        timeValues[1].textContent = timeStr.hours;
        timeValues[2].textContent = timeStr.minutes;
        timeValues[3].textContent = timeStr.seconds;
        if (diff < 1000) {
            clearInterval(intervalId);
            input.disabled = false;
            startBtn.disabled = false;
        }
    
    })
})


function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day).toString().padStart(2, '0');
    // Remaining hours
    const hours = Math.floor((ms % day) / hour).toString().padStart(2, '0');
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute).toString().padStart(2, '0');
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second).toString().padStart(2, '0');

    return { days, hours, minutes, seconds };
}