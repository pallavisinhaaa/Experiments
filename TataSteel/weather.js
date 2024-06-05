const apiKey = 'a0dfe107dc1854efcea6790a68754d59'; 

async function getWeather() {
    let city = document.getElementById('city').value.trim();
    console.log('City input:', city); 
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const weatherData = await fetchWeather(city);
    if (weatherData) {
        updateWeatherDetails(weatherData);
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        console.log('Weather API response:', data);
        if (data.cod === 200) {
            return {
                temp:Math.round(data.main.temp),
                city: data.name,
                humidity: data.main.humidity,
                wind: data.wind.speed
            };
        } else {
            alert(data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data');
        return null;
    }
}

function updateWeatherDetails(weatherData) {
    document.querySelector('.temp').textContent = `${weatherData.temp}°C`; 
    document.querySelector('.city').textContent = weatherData.city;
    document.querySelector('.humidity').textContent ="Humidity:"+ weatherData.humidity+"%";
    document.querySelector('.wind').textContent = "Wind: "+ weatherData.wind+" km/hr";
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.getElementById('result').textContent = "LISTENING...";

    recognition.start();

    recognition.onresult = function(event) {
        let city = event.results[0][0].transcript.trim();
        city = city.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); 
        document.getElementById('city').value = city;
        getWeather();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error detected: ' + event.error);
        alert('Speech recognition error detected: ' + event.error);
    };

    recognition.onspeechend = function() {
        recognition.stop();
        document.getElementById('result').textContent = "";
    };
}

document.querySelector('.bttn').addEventListener('click', getWeather);
document.getElementById('start-recognition').addEventListener('click', startVoiceRecognition);
