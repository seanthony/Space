$(document).ready(function(){

    var markup = 'Tupelo (Earth, 34.26° N, 88.72° W)<br>';
    $('#weather').append(markup);

    var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?zip=38801,us&APPID=ee02d4d4d874a5537b67f68e3cc240d2';

    $.getJSON(weatherAPI, function(result){
        var temp = (result.main.temp - 273.15)* 1.8 + 32;
            $('#weather').append('Conditions: '+ result.weather[0].main+ ', '+ temp + '° F');
        });
});
