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


var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";


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
        $('#stock-change').text(perChange);
    }else{
        $('#stock-ticker').text('Please Enter Valid Symbol')
    }
 });

} 

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
    // $("#cryptoName").text(cryptoInput.toUpperCase());

    $.ajax({
        url: cryptoURL,
        method: "GET",
        cors: true
    }).then(function (response) {
        $("#cupr").remove();
        $("#1hpc").remove();
        $("#24hpc").remove();
        $("#7dpc").remove();
        
        // console.log(response);
        for (var i=0; i < response.data.length; i++) {
            // Create list of top 25 cryptos by market cap
            var validCryptos = [
                    {"name": "Bitcoin",
                    "symbol": "btc"},
                    {"name": "Ethereum",
                    "symbol": "eth"},
                    {"name": "Litecoin",
                    "symbol": "ltc"},
                    {"name": "Ripple",
                    "symbol": "xrp"},
                    {"name": "Bitcoin Cash",
                    "symbol": "bch"},
                    {"name": "Stellar Lumens",
                    "symbol": "xlm"},
                    {"name": "Chainlink",
                    "symbol": "link"},
                    {"name": "Wrapped Bitcoin",
                    "symbol": "wbtc"},
                    {"name": "EOS",
                    "symbol": "eos"},
                    {"name": "Tezos",
                    "symbol": "xtz"},
                    {"name": "Uniswap",
                    "symbol": "uni"},
                    {"name": "Dai",
                    "symbol": "dai"},
                    {"name": "Aave",
                    "symbol": "aave"},
                    {"name": "Synthetix Network Token",
                    "symbol": "snx"},
                    {"name": "Cosmos",
                    "symbol": "atom"},
                    {"name": "yearn.finance",
                    "symbol": "yfi"},
                    {"name": "Maker",
                    "symbol": "mkr"},
                    {"name": "Filecoin",
                    "symbol": "fil"},
                    {"name": "Dash",
                    "symbol": "dash"},
                    {"name": "Ethereum Classic",
                    "symbol": "etc"},
                    {"name": "ZCash",
                    "symbol": "zec"},
                    {"name": "Compound",
                    "symbol": "comp"},
                    {"name": "Algorand",
                    "symbol": "algo"},
                    {"name": "UMA",
                    "symbol": "uma"},
                    {"name": "OMG Network",
                    "symbol": "omg"},
                ]

            
           
            if (response.data[i].symbol.toLowerCase() == cryptoInput.toLowerCase()) {
                var cName = response.data[i].name;
                var priceChg = response.data[i].quote.USD.percent_change_24h.toFixed(2);
                var priceChg1 = response.data[i].quote.USD.percent_change_1h.toFixed(2);
                var priceChg7 = response.data[i].quote.USD.percent_change_7d.toFixed(2);
                var cryptoPrice = response.data[i].quote.USD.price.toFixed(2);
                $("#cryptoName").text(cName + " - " + cryptoInput);
                $("#cryptoArea").append("<p id='cupr'>Current Price: $"+ cryptoPrice +"</p>");    
                $("#cryptoArea").append("<p id='1hpc'>1 Hour Price Change: <span id='cryptoChange1'>"+ priceChg1 + " %</span></p>");
                $("#cryptoArea").append("<p id='24hpc'>24 Hour Price Change: <span id='cryptoChange'>"+ priceChg + " %</span></p>");
                $("#cryptoArea").append("<p id='7dpc'>7 Day Price Change: <span id='cryptoChange7'>"+ priceChg7 + " %</span></p>");
                
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
            $("#cryptoName").text("This crypto search term is not supported, please choose from this list of options");
            // In this modal, could we add a list of the top 25 coins by marketcap with name and search symbol **User validation**
            $("#inputIssue").attr("style", "display: flex; background-color: yellow; color: red");
            for (j=0; j<25; j++) {
                $("#inputIssue").append("<p>Name: " + validCryptos[j].name + " -  Symbol: " + validCryptos[j].symbol + "</p>");
            }
        }
        else {
            $("#inputIssue").attr("style", "display: none");
        }
    });
    
}

$(document).on("click", "#cryptoSearch", populateCrypto);
searchStock.on('click', function(){
    var ticker = $('#stock-input').val();
    if(ticker == '') return;
    getStock(ticker);
});