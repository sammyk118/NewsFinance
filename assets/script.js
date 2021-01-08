var cityBtn = $("#searchCity");

var wKey = "dfaa5e58f81db9579a91fe56b2e69d8e";

var city = "";

function getCurrentWeather(city) {
    
}


cityBtn.on("click", function (event) {
    city = $(this).prev().val().trim();
    console.log(city);
});