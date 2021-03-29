# Key News and Financial Dashboard

For this project, we created a website that draws from 5 APIs to populate the page. It shows the current and forecasted weather, a map of the surrounding area, the current top news headline, a search bar to find stock prices, and a search bar to find crypto prices.

<hr>

## Sample View of Site
![Image](./assets/images/final-output.png)

<hr>

## Defining User Stories

**We had 5 key user stories, which we used to guide our development plan:**
1. *See current and forecasted weather for a location of a user’s choice*
2. *Display a map of the searched location to ensure it is the intended location.*
3. *Returning Users see pre-populated weather data for their last searched location.*
4. *See the top news story from the New York Times.*
5. *Search for and display stock price data.*
6. *Search for and display cryptocurrency data.*

We will run through some of the key pieces of code that we utilized to build these key user stories to build out a full functional version of the site we had designed.

<hr>

## User Story Coding

<br>

### User Story 1: Getting and Displaying Weather Location Data

To get and display live weather, date and time information, we made an external request to the Openweathermap API to get the data, then using javascript, we add the information to the main page.

```js
$.ajax({
        url: currWURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        let temp = Math.round(response.main.temp);
        currTemp.text("Temperature: " + temp + "\xB0 F");
        var weatherIcon = response.weather[0].icon;
        currTemp.append("<img src='https://openweathermap.org/img/wn/" + weatherIcon + ".png'></img>");

        latInp = response.coord.lat;
        lngInp = response.coord.lon;
        initMap(city);
    }
```

One quick callout to highlight is that within this request, we set the values for globally defined coordinate information from the Ajax call. We do this because the Google Maps API that we use later requires coordinate inputs rather than a location name.

<hr>

### User Story 2: Pre-Populate Most Recent Weather Search

**Setting**

In our search listener function, we add a step to write the defined search term into local storage for recall later.

```js
$(document).on("click", "#citySearch", function (event) {
    location = cityInput.val().trim();
    var countryStart = location.indexOf(",");
    if (countryStart !== -1) {
        city = location.substring(0,countryStart);
        countryName = location.substring(countryStart+2);
        if (countryName.length !== 2){
            var intCountry = validCountry.filter(symbol => symbol.name == countryName);            
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
    getWeather(city, country);
});
```


**Getting**

On our global js scale, we then call the information from local storage, and use the information as the inputs to the getWeather function.

```js
getWeather(
  localStorage.getItem("lastCity"),
  localStorage.getItem("lastCountry")
);
```

<hr>

### User Story 3: Provide Map for Location Search Validation

Here we reach out to the Google Maps API service, and run their map function to embed a map within our page.

This map will be centered at the coordinate values that we set previously in the weather search app.

```js
function initMap() {
    coords = {lat: latInp, lng: lngInp};
    map = new google.maps.Map(document.getElementById("map"), {
      center: coords,
      zoom: 8,
    });
```

<hr>

### User Story 4: Show Top NYT Story

Here we reach out to the NYT API service, and run their map function to embed a story within our page.


```js
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
```

<hr>

### User Story 5: Stock Price Search and Display

Here we used another AJAX link to pull stock information from the Alpha Vantage API.  As a key piece of code to ensure we were pulling the right data and hitting the right API endpoints, we used the console.table function to get cleaner and easier to digest version of the queried data.

```js
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
```

<hr>

### User Story 6: Cryptocurrency Search and Display

The cryptocurrency search and display function is similar to the stock price API pull, but due to differences in the servers behind the APIs, and the amount of data being pulled by the cryptocurrency API, we felt the need to include a loader icon so that user's know that the search is occurring.

```js
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
});
```

We achieved this by creating a loader html element on the DOM, but only allowing it to be displayed in the time between the request being sent and the request being completed.

<hr>

## Deployed Link

- [See Live Site](https://sammyk118.github.io/NewsFinance/)

## Built With

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Foundation](https://get.foundation/sites/getting-started.html)
- [Google Maps](https://developers.google.com/maps/documentation/javascript/)
- [CoinMarketCap](https://coinmarketcap.com/api/)
- [OpenWeatherMap](https://openweathermap.org/api)
- [New York Times)](https://developer.nytimes.com/apis)
- [Stocks API](https://www.alphavantage.co/)

## Authors

**Jasmine Franklin** [LinkedIn](https://www.linkedin.com/in/jasmine-franklin-8b08ba121)

**Shaun Limbeek** [LinkedIn](https://www.linkedin.com/in/shaun-limbeek/)

**Sammy Kroner** [LinkedIn](www.linkedin.com/in/samuel-kroner-44aa11169)

## License

This project is licensed under the MIT License

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

<p>&copy; UC Berkeley Extension Bootcamp.</p>
