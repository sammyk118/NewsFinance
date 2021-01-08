var searchBtn = $("#searchBtn");
var searchCity = $("#searchCity");
var currTime = $("timeOfDay");
var currDate = $("dateTime");
var currTemp = $("#temp");
var currRain = $("chanceOfRain");
var futureMinTemp = $("minTemp");
var futureMaxTemp = $("maxTemp");
var futureRain = $("chanceOfRain2");

function getWeather(city) {
    var currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + wKey;
    var futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + wKey;

    $.ajax({
        url: currWURL,
        method: "GET",
    }).then(function (response) {
        // (K − 273.15) × 9/5 + 32 
        var temp = Math.round(((response.main.temp - 273.15) * (9 / 5) + 32));
        currTemp.text("Temperature: " + temp);
        console.log(response);
    })

    $.ajax({
        url: futureWURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
    })
}

function dateAndTime() {
    var rawDate = new Date();
    rawDate = String(rawDate);
    console.log(rawDate);
    console.log(typeof rawDate);
    var prettyDate = rawDate.split(" ")[4] + " " + rawDate.split(" ")[1] + ;
    console.log(prettyDate);
}

searchBtn.on("click", function (event) {
    var city = "";
    city = searchCity.val().trim();
    console.log(city);
    getWeather(city);
});

dateAndTime();
