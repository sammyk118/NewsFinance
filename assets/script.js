var searchBtn = $("#searchBtn");
var searchCity = $("#searchCity");
var currTime = $("#timeOfDay");
var currDate = $("#dateTime");
var currTemp = $("#temp");
var currRain = $("#chanceOfRain");
var futureMinTemp = $("#minTemp");
var futureMaxTemp = $("#maxTemp");
var futureRain = $("#chanceOfRain2");

var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";



function getWeather(city) {
    var currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + wKey + "&units=imperial";
    var futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + wKey + "&units=imperial";

    $.ajax({
        url: currWURL,
        method: "GET",
    }).then(function (response) {
        currTemp.text("Temperature: " + response.main.temp);
        // console.log(response);
    })

    $.ajax({
        url: futureWURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        for (i = 0; i < response.list.length; i++){
            if (response.list[i].dt_txt.split(" ")[1] == "12:00:00") {
                futureMinTemp.text("Min: " + response.list[i].main.temp_min);
                futureMaxTemp.text("Max: " + response.list[i].main.temp_max);
                futureRain.text("Rain Chance: " + response.list[i].pop);
                break;
            }
        }
    })
}

function dateAndTime() {
    var rawDate = new Date();
    rawDate = String(rawDate);
    // console.log(rawDate);
    var timeData = rawDate.split(" ")[4];
    timeData = timeData.split(":")[0] + ":" + timeData.split(":")[1];
    var prettyDate = timeData + ", " + rawDate.split(" ")[0] + " " + rawDate.split(" ")[1] + " " + rawDate.split(" ")[2];
    // console.log(prettyDate);
    currDate.text(prettyDate);

    if (timeData.split(":")[0] < 10) {
        currTime.text("Morning");
    }
    else if (timeData.split(":")[0] > 10 && timeData.split(":")[0] < 15) {
        currTime.text("Afternoon");
    }
    else {
        currTime.text("Evening");
    }
}

searchBtn.on("click", function (event) {
    var city = "";
    city = searchCity.val().trim();
    // console.log(city);
    getWeather(city);
});

dateAndTime();