// var cityBtn = $("#searchCity");

// var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";

// var city = "";

// function getCurrentWeather(city) {
    
// }


// cityBtn.on("click", function (event) {
//     city = $(this).prev().val().trim();
//     console.log(city);
// });

// function getTeam(city) {
//     var unirest = require("unirest");

//     var req = unirest("GET", "https://therundown-therundown-v1.p.rapidapi.com/sports/2/teams");

//     req.headers({
// 	"x-rapidapi-key": "484558acf6mshfe498977bbc3248p121c38jsn77d1779f20b0",
// 	"x-rapidapi-host": "therundown-therundown-v1.p.rapidapi.com",
// 	"useQueryString": true
//     });


//     req.end(function (res) {
// 	if (res.error) throw new Error(res.error);

//     else($.ajax({
//         type: "GET",
//         url: "http://api.citybik.es/v2/networks",
//         dataType: "json",
//         success: function (response) {
//             console.log(response)
//             $('#nflTeamInfo').text()
//         }
//     });
// 	console.log(res.body);
//     }));
    
// }

$(document).ready(function () {
    var searchValue= $('#search').val()

    function getTeams(searchValue) {
        $.ajax({
            type: "GET",
            url: "https://therundown-therundown-v1.p.rapidapi.com/sports/2/teams",
            dataType: "json",
            success: function (response) {
                console.log(response)
                // $('#nflTeamInfo').empty()
                // for (i=0, i<response)
                
            }
        });
      }
  })

//   $('.forecast').empty()
//   for (i=0; i<response.list.length; i++){
//     if(response.list[i].dt_txt.indexOf("18:00:00")!== -1){
//       var col = $('<div>').addClass('col-2')
//       var card= $('<div>').addClass('card')
//       var body= $('<div>').addClass('card-body')
//       var date = $('<h6>').text(new Date(response.list[i].dt_txt).toLocaleDateString())
//       var temp=  $('<p>').text(`Temp: ${response.list[i].main.temp}`)
//       var humid= $('<p>').text(`Humidity: ${response.list[i].main.humidity}`)
//     col.append(card.append(body.append(date,temp,humid)))
//     $('.forecast').append(col)
//     }