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
    coords = {lat: latInp, lng: lngInp};   
    map = new google.maps.Map(document.getElementById("map"), {
      center: coords,
      zoom: 8,
    });
    // var marker = new google.maps.Marker({
    //     position: coords,
    //     map: map
    // });
}

function getStock(ticker='TSLA'){
    var url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ticker+'&apikey=AM5YIH12ODHXL7UF';
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
    if (country === " "){
        currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + wKey + "&units=imperial";
        futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + wKey + "&units=imperial";
    }
    else{
        currWURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city +","+ country + "&appid=" + wKey + "&units=imperial";
        futureWURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +","+ country + "&appid=" + wKey + "&units=imperial";    
    }    
    console.log(currWURL);

    $.ajax({
        url: currWURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        
        let temp = Math.round(response.main.temp);
        currTemp.text("Temperature: " + temp + "\xB0 F");
        var weatherIcon = response.weather[0].icon;
        // Should we be adding the current weather icon, as well as chance of rain in 1Hr?
        // weather icon -> response.weather[0].icon
        currTemp.append("<img src='https://openweathermap.org/img/wn/" + weatherIcon + ".png'></img>");
        
        let keys = Object.keys(response).sort();
        console.log(keys);
        console.log(keys[8]);
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
                console.log(response.list[i]);
                let Temp = Math.round(response.list[i].main.temp_min);

                futureTemp.text("Temp: " + Temp + "\xB0 F");
                futureRain.text("Rain Chance: " + response.list[i].pop + "%");
                $("#displayLctn").text(city+", "+country);
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

$(document).on("click", "#citySearch", function (event) {
    var location = "";
    var city = "";
    var countryName = "";
    var validCountry = [
        {"symbol": "AF", "name": "afghanistan"},
        {"symbol": "AX", "name": "aland islands"},
        {"symbol": "AL", "name": "albania"},
        {"symbol": "DZ", "name": "Algeria"},
        {"symbol": "AS", "name": "American Samoa"},
        {"symbol": "AD", "name": "Andorra"},
        {"symbol": "AO", "name": "Angola"},
        {"symbol": "AI", "name": "Anguilla"},
        {"symbol": "AQ", "name": "Antarctica"},
        {"symbol": "AG", "name":  "Antigua And Barbuda"},
        {"symbol": "AG", "name": "Argentina"},
        {'symbol': 'AM', 'name': 'Armenia'},
        {'symbol': 'AW', 'name': 'Aruba'},
        {'symbol': 'AU', 'name': 'Australia'},
        {'symbol': 'AT', 'name': 'Austria'},
        {'symbol': 'AZ', 'name': 'Azerbaijan'},
        {'symbol': 'BS', 'name': 'Bahamas'},
        {'symbol': 'BH', 'name': 'Bahrain'},
        {'symbol': 'BD', 'name': 'Bangladesh'},
        {'symbol': 'BB', 'name': 'Barbados'},
        {'symbol': 'BY', 'name': 'Belarus'},
        {'symbol': 'BE', 'name': 'Belgium'},
        {'symbol': 'BZ', 'name': 'Belize'},
        {'symbol': 'BJ', 'name': 'Benin'},
        {'symbol': 'BM', 'name': 'Bermuda'},
        {'symbol': 'BT', 'name': 'Bhutan'},
        {'symbol': 'BO', 'name': 'Bolivia'},
        {'symbol': 'BA', 'name': 'Bosnia And Herzegovina'},
        {'symbol': 'BW', 'name': 'Botswana'},
        {'symbol': 'BV', 'name': 'Bouvet Island'},
        {'symbol': 'BR', 'name': 'Brazil'},
        {'symbol': 'IO', 'name': 'British Indian Ocean Territory'},
        {'symbol': 'BN', 'name': 'Brunei Darussalam'},
        {'symbol': 'BG', 'name': 'Bulgaria'},
        {'symbol': 'BF', 'name': 'Burkina Faso'},
        {'symbol': 'BI', 'name': 'Burundi'},
        {'symbol': 'KH', 'name': 'Cambodia'},
        {'symbol': 'CM', 'name': 'Cameroon'},
        {'symbol': 'CA', 'name': 'Canada'},
        {'symbol': 'CV', 'name': 'Cape Verde'},
        {'symbol': 'KY', 'name': 'Cayman Islands'},
        {'symbol': 'CF', 'name': 'Central African Republic'},
        {'symbol': 'TD', 'name': 'Chad'},
        {'symbol': 'CL', 'name': 'Chile'},
        {'symbol': 'CN', 'name': 'China'},
        {'symbol': 'CX', 'name': 'Christmas Island'},
        {'symbol': 'CC', 'name': 'Cocos (Keeling) Islands'},
        {'symbol': 'CO', 'name': 'Colombia'},
        {'symbol': 'KM', 'name': 'Comoros'},
        {'symbol': 'CG', 'name': 'Congo'},
        {'symbol': 'CD', 'name': 'Congo, Democratic Republic'},
        {'symbol': 'CK', 'name': 'Cook Islands'},
        {'symbol': 'CR', 'name': 'Costa Rica'},
        {'symbol': 'CI', 'name': 'Cote D\Ivoire"'},
        {'symbol': 'HR', 'name': 'Croatia'},
        {'symbol': 'CU', 'name': 'Cuba'},
        {'symbol': 'CY', 'name': 'Cyprus'},
        {'symbol': 'CZ', 'name': 'Czech Republic'},
        {'symbol': 'DK', 'name': 'Denmark'},
        {'symbol': 'DJ', 'name': 'Djibouti'},
        {'symbol': 'DM', 'name': 'Dominica'},
        {'symbol': 'DO', 'name': 'Dominican Republic'},
        {'symbol': 'EC', 'name': 'Ecuador'},
        {'symbol': 'EG', 'name': 'Egypt'},
        {'symbol': 'SV', 'name': 'El Salvador'},
        {'symbol': 'GQ', 'name': 'Equatorial Guinea'},
        {'symbol': 'ER', 'name': 'Eritrea'},
        {'symbol': 'EE', 'name': 'Estonia'},
        {'symbol': 'ET', 'name': 'Ethiopia'},
        {'symbol': 'FK', 'name': 'Falkland Islands (Malvinas)'},
        {'symbol': 'FO', 'name': 'Faroe Islands'},
        {'symbol': 'FJ', 'name': 'Fiji'},
        {'symbol': 'FI', 'name': 'Finland'},
        {'symbol': 'FR', 'name': 'France'},
        {'symbol': 'GF', 'name': 'French Guiana'},
        {'symbol': 'PF', 'name': 'French Polynesia'},
        {'symbol': 'TF', 'name': 'French Southern Territories'},
        {'symbol': 'GA', 'name': 'Gabon'},
        {'symbol': 'GM', 'name': 'Gambia'},
        {'symbol': 'GE', 'name': 'Georgia'},
        {'symbol': 'DE', 'name': 'Germany'},
        {'symbol': 'GH', 'name': 'Ghana'},
        {'symbol': 'GI', 'name': 'Gibraltar'},
        {'symbol': 'GR', 'name': 'Greece'},
        {'symbol': 'GL', 'name': 'Greenland'},
        {'symbol': 'GD', 'name': 'Grenada'},
        {'symbol': 'GP', 'name': 'Guadeloupe'},
        {'symbol': 'GU', 'name': 'Guam'},
        {'symbol': 'GT', 'name': 'Guatemala'},
        {'symbol': 'GG', 'name': 'Guernsey'},
        {'symbol': 'GN', 'name': 'Guinea'},
        {'symbol': 'GW', 'name': 'Guinea-Bissau'},
        {'symbol': 'GY', 'name': 'Guyana'},
        {'symbol': 'HT', 'name': 'Haiti'},
        {'symbol': 'HM', 'name': 'Heard Island & Mcdonald Islands'},
        {'symbol': 'VA', 'name': 'Holy See (Vatican City State)'},
        {'symbol': 'HN', 'name': 'Honduras'},
        {'symbol': 'HK', 'name': 'Hong Kong'},
        {'symbol': 'HU', 'name': 'Hungary'},
        {'symbol': 'IS', 'name': 'Iceland'},
        {'symbol': 'IN', 'name': 'India'},
        {'symbol': 'ID', 'name': 'Indonesia'},
        {'symbol': 'IR', 'name': 'Iran, Islamic Republic Of'},
        {'symbol': 'IQ', 'name': 'Iraq'},
        {'symbol': 'IE', 'name': 'Ireland'},
        {'symbol': 'IM', 'name': 'Isle Of Man'},
        {'symbol': 'IL', 'name': 'Israel'},
        {"symbol": "IT", "name": "Italy"},
        {'symbol': 'JM', 'name': 'Jamaica'},
        {'symbol': 'JP', 'name': 'Japan'},
        {'symbol': 'JE', 'name': 'Jersey'},
        {'symbol': 'JO', 'name': 'Jordan'},
        {'symbol': 'KZ', 'name': 'Kazakhstan'},
        {'symbol': 'KE', 'name': 'Kenya'},
        {'symbol': 'KI', 'name': 'Kiribati'},
        {'symbol': 'KR', 'name': 'Korea'},
        {'symbol': 'KW', 'name': 'Kuwait'},
        {'symbol': 'KG', 'name': 'Kyrgyzstan'},
        {'symbol': 'LA', 'name': 'Lao People\s Democratic Republic"'},
        {'symbol': 'LV', 'name': 'Latvia'},
        {'symbol': 'LB', 'name': 'Lebanon'},
        {'symbol': 'LS', 'name': 'Lesotho'},
        {'symbol': 'LR', 'name': 'Liberia'},
        {'symbol': 'LY', 'name': 'Libyan Arab Jamahiriya'},
        {'symbol': 'LI', 'name': 'Liechtenstein'},
        {'symbol': 'LT', 'name': 'Lithuania'},
        {'symbol': 'LU', 'name': 'Luxembourg'},
        {'symbol': 'MO', 'name': 'Macao'},
        {'symbol': 'MK', 'name': 'Macedonia'},
        {'symbol': 'MG', 'name': 'Madagascar'},
        {'symbol': 'MW', 'name': 'Malawi'},
        {'symbol': 'MY', 'name': 'Malaysia'},
        {'symbol': 'MV', 'name': 'Maldives'},
        {'symbol': 'ML', 'name': 'Mali'},
        {'symbol': 'MT', 'name': 'Malta'},
        {'symbol': 'MH', 'name': 'Marshall Islands'},
        {'symbol': 'MQ', 'name': 'Martinique'},
        {'symbol': 'MR', 'name': 'Mauritania'},
        {'symbol': 'MU', 'name': 'Mauritius'},
        {'symbol': 'YT', 'name': 'Mayotte'},
        {'symbol': 'MX', 'name': 'Mexico'},
        {'symbol': 'FM', 'name': 'Micronesia, Federated States Of'},
        {'symbol': 'MD', 'name': 'Moldova'},
        {'symbol': 'MC', 'name': 'Monaco'},
        {'symbol': 'MN', 'name': 'Mongolia'},
        {'symbol': 'ME', 'name': 'Montenegro'},
        {'symbol': 'MS', 'name': 'Montserrat'},
        {'symbol': 'MA', 'name': 'Morocco'},
        {'symbol': 'MZ', 'name': 'Mozambique'},
        {'symbol': 'MM', 'name': 'Myanmar'},
        {'symbol': 'NA', 'name': 'Namibia'},
        {'symbol': 'NR', 'name': 'Nauru'},
        {'symbol': 'NP', 'name': 'Nepal'},
        {'symbol': 'NL', 'name': 'Netherlands'},
        {'symbol': 'AN', 'name': 'Netherlands Antilles'},
        {'symbol': 'NC', 'name': 'New Caledonia'},
        {'symbol': 'NZ', 'name': 'New Zealand'},
        {'symbol': 'NI', 'name': 'Nicaragua'},
        {'symbol': 'NE', 'name': 'Niger'},
        {'symbol': 'NG', 'name': 'Nigeria'},
        {'symbol': 'NU', 'name': 'Niue'},
        {'symbol': 'NF', 'name': 'Norfolk Island'},
        {'symbol': 'MP', 'name': 'Northern Mariana Islands'},
        {'symbol': 'NO', 'name': 'Norway'},
        {'symbol': 'OM', 'name': 'Oman'},
        {'symbol': 'PK', 'name': 'Pakistan'},
        {'symbol': 'PW', 'name': 'Palau'},
        {'symbol': 'PS', 'name': 'Palestinian Territory, Occupied'},
        {'symbol': 'PA', 'name': 'Panama'},
        {'symbol': 'PG', 'name': 'Papua New Guinea'},
        {'symbol': 'PY', 'name': 'Paraguay'},
        {'symbol': 'PE', 'name': 'Peru'},
        {'symbol': 'PH', 'name': 'Philippines'},
        {'symbol': 'PN', 'name': 'Pitcairn'},
        {'symbol': 'PL', 'name': 'Poland'},
        {'symbol': 'PT', 'name': 'Portugal'},
        {'symbol': 'PR', 'name': 'Puerto Rico'},
        {'symbol': 'QA', 'name': 'Qatar'},
        {'symbol': 'RE', 'name': 'Reunion'},
        {'symbol': 'RO', 'name': 'Romania'},
        {'symbol': 'RU', 'name': 'Russian Federation'},
        {'symbol': 'RW', 'name': 'Rwanda'},
        {'symbol': 'BL', 'name': 'Saint Barthelemy'},
        {'symbol': 'SH', 'name': 'Saint Helena'},
        {'symbol': 'KN', 'name': 'Saint Kitts And Nevis'},
        {'symbol': 'LC', 'name': 'Saint Lucia'},
        {'symbol': 'MF', 'name': 'Saint Martin'},
        {'symbol': 'PM', 'name': 'Saint Pierre And Miquelon'},
        {'symbol': 'VC', 'name': 'Saint Vincent And Grenadines'},
        {'symbol': 'WS', 'name': 'Samoa'},
        {'symbol': 'SM', 'name': 'San Marino'},
        {'symbol': 'ST', 'name': 'Sao Tome And Principe'},
        {'symbol': 'SA', 'name': 'Saudi Arabia'},
        {'symbol': 'SN', 'name': 'Senegal'},
        {'symbol': 'RS', 'name': 'Serbia'},
        {'symbol': 'SC', 'name': 'Seychelles'},
        {'symbol': 'SL', 'name': 'Sierra Leone'},
        {'symbol': 'SG', 'name': 'Singapore'},
        {'symbol': 'SK', 'name': 'Slovakia'},
        {'symbol': 'SI', 'name': 'Slovenia'},
        {'symbol': 'SB', 'name': 'Solomon Islands'},
        {'symbol': 'SO', 'name': 'Somalia'},
        {'symbol': 'ZA', 'name': 'South Africa'},
        {'symbol': 'GS', 'name': 'South Georgia And Sandwich Isl.'},
        {'symbol': 'ES', 'name': 'Spain'},
        {'symbol': 'LK', 'name': 'Sri Lanka'},
        {'symbol': 'SD', 'name': 'Sudan'},
        {'symbol': 'SR', 'name': 'Suriname'},
        {'symbol': 'SJ', 'name': 'Svalbard And Jan Mayen'},
        {'symbol': 'SZ', 'name': 'Swaziland'},
        {'symbol': 'SE', 'name': 'Sweden'},
        {'symbol': 'CH', 'name': 'Switzerland'},
        {'symbol': 'SY', 'name': 'Syrian Arab Republic'},
        {'symbol': 'TW', 'name': 'Taiwan'},
        {'symbol': 'TJ', 'name': 'Tajikistan'},
        {'symbol': 'TZ', 'name': 'Tanzania'},
        {'symbol': 'TH', 'name': 'Thailand'},
        {'symbol': 'TL', 'name': 'Timor-Leste'},
        {'symbol': 'TG', 'name': 'Togo'},
        {'symbol': 'TK', 'name': 'Tokelau'},
        {'symbol': 'TO', 'name': 'Tonga'},
        {'symbol': 'TT', 'name': 'Trinidad And Tobago'},
        {'symbol': 'TN', 'name': 'Tunisia'},
        {'symbol': 'TR', 'name': 'Turkey'},
        {'symbol': 'TM', 'name': 'Turkmenistan'},
        {'symbol': 'TC', 'name': 'Turks And Caicos Islands'},
        {'symbol': 'TV', 'name': 'Tuvalu'},
        {'symbol': 'UG', 'name': 'Uganda'},
        {'symbol': 'UA', 'name': 'Ukraine'},
        {'symbol': 'AE', 'name': 'United Arab Emirates'},
        {'symbol': 'GB', 'name': 'United Kingdom'},
        {'symbol': 'US', 'name': 'United States'},
        {'symbol': 'UM', 'name': 'United States Outlying Islands'},
        {'symbol': 'UY', 'name': 'Uruguay'},
        {'symbol': 'UZ', 'name': 'Uzbekistan'},
        {'symbol': 'VU', 'name': 'Vanuatu'},
        {'symbol': 'VE', 'name': 'Venezuela'},
        {'symbol': 'VN', 'name': 'Vietnam'},
        {'symbol': 'VG', 'name': 'Virgin Islands, British'},
        {'symbol': 'VI', 'name': 'Virgin Islands, U.S.'},
        {'symbol': 'WF', 'name': 'Wallis And Futuna'},
        {'symbol': 'EH', 'name': 'Western Sahara'},
        {'symbol': 'YE', 'name': 'Yemen'},
        {'symbol': 'ZM', 'name': 'Zambia'},
        {'symbol': 'ZW', 'name': 'Zimbabwe'}    
    ]
    
    location = cityInput.val().trim();
    var countryStart = location.indexOf(",");
    if (countryStart !== -1) {
        city = location.substring(0,countryStart);
        countryName = location.substring(countryStart+2);
        if (countryName.length !== 2){
            var intCountry = validCountry.filter(symbol => symbol.name == countryName);
            // console.log(city);
            // console.log(intCountry[0].symbol);
            country = intCountry[0].symbol;
        }
        else{
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

getWeather(localStorage.getItem("lastCity"),localStorage.getItem("lastCountry"));

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
        beforeSend: function(){
            $("#loaderCirc").attr("style", "display: flex");
        },
        complete: function(){
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

