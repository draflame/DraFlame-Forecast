async function fetchTime(timezone) {
    const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
    const data = await response.json();
    return data.datetime;
}
let timeElements = document.querySelector('.time');
async function fetchLocation(ip) {
    const response = await fetch(`https://api.ip2location.io/?key=C5EFA7DD020064E32D44AD59F99ADD80&ip=123.28.209.108`);
    const data = await response.json();
    return data;
}

let pcTimeZone= Intl.DateTimeFormat().resolvedOptions().timeZone
timeElements.setAttribute('data-timezone',pcTimeZone)
function changeTZ(){
    let tz= pcTimeZone.split('/')[1]
    tz=tz.replace('_', ' ')
    timeElements.setAttribute('data-city',tz)

}
changeTZ()


async function updateTime() {
    const timezone = timeElements.getAttribute('data-timezone');
    const datetime = await fetchTime(timezone);
    const time = datetime.split('.')[0].split('T')[1];
    timeElements.textContent = time;
}

// Lấy địa chỉ IP v4 hoặc v6 của máy người dùng
function getIPAddress(callback) {
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            callback(null, data.ip);
        })
        .catch(error => {
            callback(error, null);
        });
}

// Sử dụng hàm để lấy địa chỉ IP
getIPAddress(function(error, ip) {
    if (error) {
        console.error('Lỗi khi lấy địa chỉ IP:', error);
    } else {
        console.log('Địa chỉ IP của bạn là:', ip);
        fetchLocation(ip)
            .then(data => {
                console.log('Thông tin địa lý:', data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin địa lý:', error);
            });
    }
});

setInterval(updateTime, 1000); 
updateTime();
let apiKey= '3f11a5f3a0a34f8986a211549243005'

async function fetchWeatherData(cityName) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return data;
}

function getValue(){
    let cityName= document.getElementById('search').value
        fetchWeatherData(cityName)
        .then(data => {
            console.log('Weather data:', data);
            timeElements.setAttribute('data-city',data.location.name)
            timeElements.setAttribute('data-timezone',data.location.tz_id)
            loadData()
            
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
    
function loadData(){
    let city= document.querySelector('.info h2')
    let country= document.querySelector('.info h4')
    let tz_id=timeElements.getAttribute('data-city')
    let time =document.querySelector('#day')
    let deg= document.querySelector('.degree span')
    let wind=document.querySelector('.wind')
    let weather=document.getElementById('weather')
    let humidity=document.querySelector('.humidity')
    
    console.log('tz_id', tz_id);
    fetchWeatherData(tz_id)
    .then(data => {
        console.log('Weather data:', data);
        let locationTime = new Date(data.location.localtime).toString()
        console.log('Location time:', locationTime)
        city.innerHTML= data.location.name
        time.innerHTML=`<span class="day">${locationTime.split(' ')[0]}</span> ${locationTime.split(' ')[1]} ${locationTime.split(' ')[2]} ${locationTime.split(' ')[3]} `
        timeElements.setAttribute('data-timezone',data.location.tz_id)
        timeElements.setAttribute('data-city',data.location.name)
        country.innerHTML= data.location.country
        deg.innerHTML=`${data.current.feelslike_c}<sup>&degC</sup>`
        wind.innerHTML=`
        <img src="../img/wind.png" class="img-fluid w-50" alt="" />
            <p>Dir: ${data.current.wind_dir}</p>
            <p><span>${data.current.wind_kph}</span>km/h</p>
        `
        weather.innerHTML=`
        <img
              src="${data.current.condition.icon}"
              class="img-fluid"
              alt=""
            />
            <p>${data.current.condition.text}</p>
        `
        humidity.innerHTML=`
        <img src="../img/humidity.png" class="img-fluid w-50" alt="" />
            <p>${data.current.humidity} g/m<sup>3</sup></p>
        `
        changeBG()
        
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
   

}
loadData()
async function changeBG(){
    let bg=document.querySelector('.dashboard')
   
    const timezone = timeElements.getAttribute('data-timezone');
    const datetime = await fetchTime(timezone);
    const time= datetime.split('.')[0].split('T')[1]
    // let weather = document.querySelector('#weather p').textContent
 
    // if(weather.includes("rain")){
    //     bg.style.backgroundImage ="url('../img/rainy.jpg')"
    // } 
    // else 
    if((time.split(':')[0]>18 && time.split(':')[0]<=23)||(time.split(':')[0]>0 && time.split(':')[0]<5)){
        bg.style.backgroundImage ="url('../img/night.jpg')"
    }
    else if(time.split(':')[0]==0){
        bg.style.backgroundImage ="url('../img/midnight.jpg')"
    }
    else if(time.split(':')[0]>=5&&time.split(':')[0]<=7){
        bg.style.backgroundImage ="url('../img/dawn.jpg')"
    }
    else if(time.split(':')[0]>7&&time.split(':')[0]<=11){
        bg.style.backgroundImage ="url('../img/morning.jpg')"
    }
    else if(time.split(':')[0]==12){
        bg.style.backgroundImage ="url('../img/noon.jpg')"
    }
    else if(time.split(':')[0]>12&&time.split(':')[0]<=17){
        bg.style.backgroundImage ="url('../img/afternoon.jpg')"
    }
    else if(time.split(':')[0]>=17&&time.split(':')[0]<=18){
        bg.style.backgroundImage ="url('../img/dusk.jpg')"
    }

}
setInterval(changeBG(),60000)



document.getElementById('search').addEventListener('keydown', function(event){
    if(event.keyCode===13){
        getValue()
    }
})

document.getElementById('btn-search').addEventListener('click', function(){
    getValue()
})



