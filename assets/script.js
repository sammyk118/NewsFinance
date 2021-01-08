var searchBtn = $("#searchBtn");
var searchCity = $("#searchCity");
var currTime = $("timeOfDay");
var currDate = $("dateTime");
var currTemp = $("#temp");
var currRain = $("chanceOfRain");
var futureMinTemp = $("minTemp");
var futureMaxTemp = $("maxTemp");
var futureRain = $("chanceOfRain2");

var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";



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

function populateCrypto (event) {
    event.preventDefault();
    var apikey = "8e3a7aa0-9ee8-452e-aaf7-fabcc9ed8aae";
    var cryptoURL = "https://cors-anywhere.herokuapp.com/http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY="+apikey;
    var cryptoInput = $("#cryptoInput").val().trim();
    console.log(cryptoURL);
    $("#cryptoName").text(cryptoInput.toUpperCase());

    $.ajax({
        url: cryptoURL,
        method: "GET",
        cors: true
    }).then(function (response) {
        
        console.log(response.data[0].symbol);
        console.log(cryptoInput);
        for (var i=0; i < response.data.length; i++) {
           if (response.data[i].symbol.toLowerCase() == cryptoInput.toLowerCase()) {
            $("#cryptoPrice").text("$"+response.data[i].quote.USD.price.toFixed(2));    
           }
        }
        
    });
    
}

$(document).on("click", "#cryptoSearch", populateCrypto);