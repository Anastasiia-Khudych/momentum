import playList from './playList.js';

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const optionsForDate = { weekday: 'long', month: 'long', day: 'numeric' };
const greeting = document.querySelector('.greeting');
const inputName = document.querySelector('.name');
const body = document.querySelector('body');
const nextBtn = document.querySelector('.slide-next');
const prevBtn = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const quoteAuthor = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const audioList = document.querySelector('.play-list');


// Time and date----------------------------------------------------------------------------------------------------

function showTime() {
    time.textContent = new Date().toLocaleTimeString();
    showDate();
    writeGreeting();
    setTimeout(showTime, 1000);
}
showTime();

function showDate() {
    date.textContent = new Date().toLocaleDateString('en-US', optionsForDate);
}


// Greeting---------------------------------------------------------------------------------------------------------

function getTimeOfDay() {
    let currentTime = new Date().getHours();

    if (currentTime >= 6 && currentTime <= 11) {
        return 'morning';
    } else if (currentTime >= 12 && currentTime <= 17) {
        return 'afternoon';
    } else if (currentTime >= 18 && currentTime <= 23) {
       return 'evening';
    } else if (currentTime >= 0 && currentTime <= 5) {
        return 'night';
    } 
}

function writeGreeting() {
    greeting.textContent = `Good ${getTimeOfDay()}`;
}

// Write the name value in local storage 

function setLocalStorage(itemName) {
    localStorage.setItem(itemName, itemName.value);
}

// // Pull the name value from the local storage

function getLocalStorage(itemName) {
    if (localStorage.getItem(itemName)) {
        itemName.value = localStorage.getItem(itemName);
    }
}

window.addEventListener('beforeunload', () => {
    setLocalStorage(inputName);
});

window.addEventListener('load', () => {
    getLocalStorage(inputName);
    // getWeather(localStorage.getItem('city'));
    if (localStorage.getItem('city')) {
        getWeather(localStorage.getItem('city'));
    } else getWeather('Kyiv');
});


// Image slider--------------------------------------------------------------------------------------------------------

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

let randomNum = getRandomNum(1, 20);

function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = randomNum.toString().padStart(2, '0');
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Anastasiia-Khudych/momentum_bg-images/master/${timeOfDay}/${bgNum}.webp`;
    
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/Anastasiia-Khudych/momentum_bg-images/master/${timeOfDay}/${bgNum}.webp')`;
    })
    
    setTimeout(setBg, 1000 * 60 * 60);
}
setBg()

// Next slide image

function getSlideNext() {
    if (randomNum < 20) {
        randomNum++;
    } else if (randomNum === 20) {
        randomNum = 1;
    }
    setBg();
}

function getSlidePrev () {
    if (randomNum > 1) {
        randomNum--;
    } else if (randomNum === 1) {
        randomNum = 20;
    }
    setBg();
}

nextBtn.addEventListener('click', getSlideNext);
prevBtn.addEventListener('click', getSlidePrev);



// Weather API------------------------------------------------------------------------------------------------------


async function getWeather(cityName) {
    city.value = cityName;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=17abde09d291d94c8f67bd8e33426c6d&units=metric`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (data.cod === "400" || data.cod === "404") {
        weatherError.textContent = data.message;
        weatherIcon.classList.add('hide');
        temperature.classList.add('hide');
        weatherDescription.classList.add('hide');
        wind.classList.add('hide');
        humidity.classList.add('hide');
    } else {
        weatherError.textContent = ' ';
        weatherIcon.classList.remove('hide');
        temperature.classList.remove('hide');
        weatherDescription.classList.remove('hide');
        wind.classList.remove('hide');
        humidity.classList.remove('hide');
            
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `wind speed: ${Math.round(data.wind.speed)}m/s`;
        humidity.textContent = `humidity: ${Math.round(data.main.humidity)}%`;
        }
}

getWeather()

city.addEventListener('change', () => {
    localStorage.setItem('city', city.value);
    getWeather(city.value);
})


// Quotes------------------------------------------------------------------------------------------------------------

async function getQuotes() {  
  const quotes = 'https://raw.githubusercontent.com/Anastasiia-Khudych/momentum_quotes/master/quotes.json';
  const res = await fetch(quotes);
  const data = await res.json(); 
    
  let randomNum = getRandomNum(1, 101);
  quote.textContent = data.quotes[randomNum].quote;
  quoteAuthor.textContent = data.quotes[randomNum].author;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);




// Audio

const audio = new Audio();
let isPlay = false;
let playNum = 0;

playBtn.addEventListener('click', playOrPauseAudio);

function playOrPauseAudio() {
    if (isPlay === false) {
        playAudio();
    } else {
        pauseAudio();
    }
}

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;

    playBtn.classList.remove('play');
    playBtn.classList.add('pause');
}

function pauseAudio() {
    audio.pause();
    isPlay = false;

    playBtn.classList.remove('pause');
    playBtn.classList.add('play');
}


playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);

function playNext() {
    if (playNum < playList.length - 1) {
        playNum += 1;
    } else if (playNum === playList.length - 1) {
        playNum = 0;
    }

    playAudio();
}

function playPrev() {
    if (playNum === 0) {
        playNum = playList.length - 1;
    } else if (playNum <= playList.length - 1)  {
       playNum -= 1;
    } 
    
    playAudio();
}


playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = element.title;
    audioList.append(li);
});










