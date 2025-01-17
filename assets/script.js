var citySearch = $("#citySearch");
var cityInput = $("#cityInput");
var currTime = $("#timeOfDay");
var currDate = $("#dateTime");
var currTemp = $("#temp");
var currWeather = $("#chanceOfWeather");
var weatherIcon = $("#weatherIcon");
var futureTemp = $("#temp2");
var futureMaxTemp = $("#maxTemp");
var futureRain = $("#chanceOfRain2");
var searchStock = $("#search-stock");
var coords = {};
var latInp = 0;
var lngInp = 0;

var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";

// Create function to run google maps API
let map;

function initMap() {
    coords = { lat: latInp, lng: lngInp };
    map = new google.maps.Map(document.getElementById("map"), {
        center: coords,
        zoom: 8,
    });
    // var marker = new google.maps.Marker({
    //     position: coords,
    //     map: map
    // });
}

function getStock(ticker = 'TSLA') {
    var url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + ticker + '&apikey=AM5YIH12ODHXL7UF';
    $.ajax({
        url: url,
        method: 'GET',
    }).then(function (response) {
        console.log(response)
        var stock, price, high, low, perChange;
        var globalQuote = response['Global Quote']
        console.table(globalQuote);
        if (globalQuote.hasOwnProperty('01. symbol')) {
            stock = globalQuote['01. symbol'];
            price = globalQuote['05. price'];
            high = globalQuote['03. high'];
            low = globalQuote['04. low'];
            perChange = globalQuote['10. change percent'];
            console.log(stock, price, high, low, perChange);
            $('#stock-ticker').text(stock);
            $('#stock-price').text(price);
            $('#stock-high').text(high);
            $('#stock-low').text(low);
            if (perChange >= 0) {
                $("#stock-change").attr("style", "color: green");
            }
            else {
                $("#stock-change").attr("style", "color: red");
            }
            $('#stock-change').text(perChange);
        } else {
            $('#stock-ticker').text('Please Enter Valid Symbol')
        }
    });

}

// ======================================================================================


function getWeather(city, country) {
    var currWURL = "";
    var futureWURL = "";
    if (country === " ") {
        currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + wKey + "&units=imperial";
        futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + wKey + "&units=imperial";
    }
    else {
        currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&appid=" + wKey + "&units=imperial";
        futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&appid=" + wKey + "&units=imperial";
    }
    console.log(currWURL);

    $.ajax({
        url: currWURL,
        method: "GET",
    }).then(function (response) {
        console.log("current weather: ", response);

        let temp = Math.round(response.main.temp);
        currTemp.text("Temperature: " + temp + "\xB0 F");
        var weatherIcon = response.weather[0].icon;
        // Should we be adding the current weather icon, as well as chance of rain in 1Hr?
        // weather icon -> response.weather[0].icon
        currTemp.append("<img src='https://openweathermap.org/img/wn/" + weatherIcon + ".png'></img>");

        let keys = Object.keys(response).sort();
        // console.log(keys);
        // console.log(keys[8]);
        // todo: find a better way to render weather events to webpage
        if (keys[8] != "sys") {
            console.log(keys[8], " has a weather event")
            var weatherEvent = keys[8];
            currWeather.text("Chance of " + weatherEvent);
        }
        else {
            currWeather.text("No rain or snow");
        }


        latInp = response.coord.lat;
        lngInp = response.coord.lon;
        initMap(city);

        // weatherIcon.attr("src","https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        // weatherIcon.attr("alt", response.weather[0].description);
    })

    $.ajax({
        url: futureWURL,
        method: "GET",
    }).then(function (response) {
        // console.log(response);
        for (i = 0; i < response.list.length; i++) {
            if (response.list[i].dt_txt.split(" ")[1] == "12:00:00") {
                console.log("future weather: ", response.list[i]);
                let Temp = Math.round(response.list[i].main.temp_min);

                futureTemp.text("Temp: " + Temp + "\xB0 F");
                futureRain.text("Rain Chance: " + response.list[i].pop + "%");
                $("#displayLctn").text(city + ", " + country);
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


function cityList(input) {
    //let user choose 
}

$(document).on("click", citySearch, function (event) {

    var location = "";
    var city = "";
    var countryName = "";

    location = cityInput.val().trim();
    var countryStart = location.indexOf(",");
    if (countryStart !== -1) {
        city = location.substring(0, countryStart);
        countryName = location.substring(countryStart + 2);
        if (countryName.length !== 2) {
            var intCountry = countries.filter(symbol => symbol.name == countryName);
            // console.log(city);
            // console.log(intCountry[0].symbol);
            country = intCountry[0].symbol;
        }
        else {
            country = countryName;
        }

    }
    else {
        city = location;
        country = " ";
    }


    localStorage.setItem("lastCity", city);
    localStorage.setItem("lastCountry", country);
    // console.log(city);
    getWeather(city, country);

});

setInterval(dateAndTime, 1000);
console.log("last city: ", localStorage.getItem("lastCity"));
getWeather(localStorage.getItem("lastCity"), localStorage.getItem("lastCountry"));

function populateCrypto(event) {
    event.preventDefault();
    var apikey = "bcaefdec-464b-49f4-984a-0a41466e7a71";
    var cryptoURL = "https://corsanywhere.herokuapp.com/http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=" + apikey;
    var cryptoInput = $("#cryptoInput").val().trim();

    // Need to add in a loader that shows until the response comes in
    // Before the response comes in show the loader
    // $("#loaderCirc").attr("style", "display: flex");

    // Once the response arrives, hide the loader
    // $("#loaderCirc").attr("style", "display: none");

    $.ajax({
        url: cryptoURL,
        method: "GET",
        cors: true,
        beforeSend: function () {
            $("#loaderCirc").attr("style", "display: flex");
        },
        complete: function () {
            $("#loaderCirc").attr("style", "display: none");
        },
    }).then(function (response) {
        $("#cupr").remove();
        $("#1hpc").remove();
        $("#24hpc").remove();
        $("#7dpc").remove();

        // console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            // Create list of top 25 cryptos by market cap
            var validCryptos = [
                {
                    "name": "Bitcoin",
                    "symbol": "btc"
                },
                {
                    "name": "Ethereum",
                    "symbol": "eth"
                },
                {
                    "name": "Litecoin",
                    "symbol": "ltc"
                },
                {
                    "name": "Ripple",
                    "symbol": "xrp"
                },
                {
                    "name": "Bitcoin Cash",
                    "symbol": "bch"
                },
                {
                    "name": "Stellar Lumens",
                    "symbol": "xlm"
                },
                {
                    "name": "Chainlink",
                    "symbol": "link"
                },
                {
                    "name": "Wrapped Bitcoin",
                    "symbol": "wbtc"
                },
                {
                    "name": "EOS",
                    "symbol": "eos"
                },
                {
                    "name": "Tezos",
                    "symbol": "xtz"
                },
                {
                    "name": "Uniswap",
                    "symbol": "uni"
                },
                {
                    "name": "Dai",
                    "symbol": "dai"
                },
                {
                    "name": "Aave",
                    "symbol": "aave"
                },
                {
                    "name": "Synthetix Network Token",
                    "symbol": "snx"
                },
                {
                    "name": "Cosmos",
                    "symbol": "atom"
                },
                {
                    "name": "yearn.finance",
                    "symbol": "yfi"
                },
                {
                    "name": "Maker",
                    "symbol": "mkr"
                },
                {
                    "name": "Filecoin",
                    "symbol": "fil"
                },
                {
                    "name": "Dash",
                    "symbol": "dash"
                },
                {
                    "name": "Ethereum Classic",
                    "symbol": "etc"
                },
                {
                    "name": "ZCash",
                    "symbol": "zec"
                },
                {
                    "name": "Compound",
                    "symbol": "comp"
                },
                {
                    "name": "Algorand",
                    "symbol": "algo"
                },
                {
                    "name": "UMA",
                    "symbol": "uma"
                },
                {
                    "name": "OMG Network",
                    "symbol": "omg"
                },
            ]



            if (response.data[i].symbol.toLowerCase() == cryptoInput.toLowerCase()) {
                var cName = response.data[i].name;
                var priceChg = response.data[i].quote.USD.percent_change_24h.toFixed(2);
                var priceChg1 = response.data[i].quote.USD.percent_change_1h.toFixed(2);
                var priceChg7 = response.data[i].quote.USD.percent_change_7d.toFixed(2);
                var cryptoPrice = response.data[i].quote.USD.price.toFixed(2);
                $("#cryptoName").text(cName + " - " + cryptoInput);
                $("#cryptoArea").append("<p id='cupr'>Current Price: $" + cryptoPrice + "</p>");
                $("#cryptoArea").append("<p id='1hpc'>1 Hour Price Change: <span id='cryptoChange1'>" + priceChg1 + " %</span></p>");
                $("#cryptoArea").append("<p id='24hpc'>24 Hour Price Change: <span id='cryptoChange'>" + priceChg + " %</span></p>");
                $("#cryptoArea").append("<p id='7dpc'>7 Day Price Change: <span id='cryptoChange7'>" + priceChg7 + " %</span></p>");

                if (priceChg >= 0) {
                    $("#cryptoChange").attr("style", "color: green");
                }
                else {
                    $("#cryptoChange").attr("style", "color: red");
                }
                if (priceChg7 >= 0) {
                    $("#cryptoChange7").attr("style", "color: green");
                }
                else {
                    $("#cryptoChange7").attr("style", "color: red");
                }
                if (priceChg1 >= 0) {
                    $("#cryptoChange1").attr("style", "color: green");
                }
                else {
                    $("#cryptoChange1").attr("style", "color: red");
                }
            }

        }
        // Create a check to see if the crypto entered exists
        if (!priceChg) {
            // When it doesn't, we need to pop out a modal that says this crypto doesn't exist.
            // $("#cryptoName").text("This crypto search term is not supported, please choose from this list of options");
            // In this modal, could we add a list of the top 25 coins by marketcap with name and search symbol **User validation**
            $("#inputIssue").attr("style", "display: flex; background-color: yellow; color: red");
            $("#crypto").attr("style", "display: none;");
            for (j = 0; j < 25; j++) {
                $("#validCryptos").append("<tr><td>" + validCryptos[j].name + "</td><td>" + validCryptos[j].symbol + "</td></tr>");

            }
        }
        else {
            $("#inputIssue").attr("style", "display: none");
        }
    });

}


function reShowCrypto() {
    $("#inputIssue").attr("style", "display: none");
    $("#crypto").attr("style", "display: flex;");
}



$(document).on("click", "#cryptoSearch", populateCrypto);

$(document).on("click", "#modalBtn", reShowCrypto);


searchStock.on('click', function () {
    var ticker = $('#stock-input').val();
    if (ticker == '') return;
    getStock(ticker);
});


// Create API pull for top story from NYT

function topNews() {

    var newsURL = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=AU7INFiCVrpNoBfLn4anuAftA5AfsHf2";

    $.ajax({
        url: newsURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        $("#newsTitle").text(response.results[0].title);
        $("#newsThumb").attr("src", response.results[0].multimedia[3].url);
        $("#newsThumb").attr("alt", response.results[0].multimedia[3].caption);
        $("#storyDetail").text(response.results[0].abstract);
        $("#storyLink").attr("href", response.results[0].url);

    })
}

topNews();

