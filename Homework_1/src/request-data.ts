function buttonClick() {
    let x = document.getElementsByClassName('weather');
    while(x[0]){
        x[0].parentNode.removeChild(x[0]);
    }
    fetch('/random/weather')
        .then(response => response.json())
        .then(data => {
            let newDiv = document.createElement('div');
            newDiv.className = 'weather';
            let day = data.forecast.forecastday[0];
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            p1.innerText = `In ${data.location.name}, ${data.location.region}, ${data.location.country}, in the\
             date of ${day.date}, it was ${day.day.condition.text}`;
            day = day.day;
            p2.innerText = `Max temp.: ${day.maxtemp_c}°C, min temp.: ${day.mintemp_c}°C, avg. temp.: ${day.avgtemp_c}°C`
            newDiv.appendChild(p1);
            newDiv.appendChild(p2);
            let btn = document.getElementById('btn');
            document.body.appendChild(newDiv);
            btn.innerText = "Get another random Weather";
        });
}
buttonClick();