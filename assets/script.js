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

