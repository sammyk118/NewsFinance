var searchBtn = $("#searchBtn");
var searchCity = $("#searchCity");
var currTime = $("#timeOfDay");
var currDate = $("#dateTime");
var currTemp = $("#temp");
var currRain = $("#chanceOfRain");
var futureMinTemp = $("#minTemp");
var futureMaxTemp = $("#maxTemp");
var futureRain = $("#chanceOfRain2");
var searchStock = $("#search-stock");

// =====================================================================

function getStock(ticker='TSLA'){
    var url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ticker+'&apikey=AM5YIH12ODHXL7UF';
    $.ajax({
        url : url,
        method: 'GET',
    }).then(function(response) {
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
        $('#stock-change').text(change);
    } else {
        alert('Please Provide Valid Ticker');
    }

    });

}

// function getStock(ticker='TSLA') {
//     var searchStock= $('#search-stock');
//     var url='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ticker+'&apikey=YD43NGRDHKUNLAFD';

//     $.ajax({
//         url: url,
//         method: 'GET',
//     }).then(function (response) {
//         // console.log(response);
//         var stock, price, perChange;
//         if(!response.hasOwnProperty['Global Quote']){
//             alert()
//             return
//         }
//         var globalQuote=response['Global Quote'];
//         if(globalQuote.hasOwnProperty('01.symbol')){
//             stock= globalQuote['01.symbol'];
//             price= globalQuote['05.price'];
//             perChange= globalQuote['10.change percent'];
//             $('#stock-ticker').text(stock);
//             $('#stock-price').text(price);
//             $('#stock-high').text();
//             $('#stock-low').text();
//             $('#stock-change').text();

//         }else{
//             $('#stock-ticker').text("Please enter valid ticker")

//         }

//       });
//   }

// ======================================================================================

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
        
        
        // console.log(response);
        for (var i=0; i < response.data.length; i++) {
           if (response.data[i].symbol.toLowerCase() == cryptoInput.toLowerCase()) {
            var priceChg = response.data[i].quote.USD.percent_change_24h.toFixed(2);
            var priceChg1 = response.data[i].quote.USD.percent_change_1h.toFixed(2);
            var priceChg7 = response.data[i].quote.USD.percent_change_7d.toFixed(2);
            var cryptoPrice = response.data[i].quote.USD.price.toFixed(2);
            $("#cryptoArea").append("<p>Current Price: $"+ cryptoPrice +"</p>");    
            $("#cryptoArea").append("<p>1 Hour Price Change: <span id='cryptoChange1'>"+ priceChg1 + " %</span></p>");
            $("#cryptoArea").append("<p>24 Hour Price Change: <span id='cryptoChange'>"+ priceChg + " %</span></p>");
            $("#cryptoArea").append("<p>7 Day Price Change: <span id='cryptoChange7'>"+ priceChg7 + " %</span></p>");
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
        
    });
    
}

$(document).on("click", "#cryptoSearch", populateCrypto, getStock);

