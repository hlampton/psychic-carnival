$(document).ready(function () {

    // Displays the current Day
    var today = dayjs();
    $('#date').text(today.format('MM DD YYYY'));    
    $("#searchBtn").click(function () {
        var cityName = $("#searchText").val();
        var apiKey = "6a921aa02457f12cb1865f66e58e84cb";
        var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
        // AJAX call pulls weather data
        var forecastData = [];
        $.ajax({
            url: weatherUrl,
            method: "GET"
        }).then(function (response) {
            $("#cityName").text(response.name);
            $("#weatherImage").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            $("#temp").html(response.main.temp + '\u00B0');
            $("#humidity").html(response.main.humidity + '%');
            $("#wind").html(response.wind.speed + ' mph');
            var cityWeatherData = {
                city: response.name,
                weatherImage: response.weather[0].icon,
                temperature: response.main.temp,
                humidity: response.main.humidity,
                wind: response.wind.speed,
                forecast: forecastData,
            };
            // saves the city searched and the data for that city to local storage
            localStorage.setItem("cityWeatherData", JSON.stringify(cityWeatherData));
            localStorage.setItem(response.name.toLowerCase(), JSON.stringify(cityWeatherData));
            console.log(cityWeatherData);
        });
        // AJAX call pulls 5-day forecast
        var fiveDayForcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
        $("#forecast").empty();

        $.ajax({
            url: fiveDayForcast,
            method: "GET"
        }).then(function (response5) {
            for (i = 0; i < response5.list.length; i++) {
                if (response5.list[i].dt_txt.split(" ")[1] === "21:00:00") {
                    var containerColumn = $("<div class='col-s-1' id='fiveDay'>");
                    // date is displayed YYYY MM DD need to get it to say MM DD YYYY
                    var dateEl = $("<h6>").append("Date: " + response5.list[i].dt_txt.split(" ")[0]);
                    var iconEl = $("<h6>").append("<img src='https://openweathermap.org/img/w/" + response5.list[i].weather[0].icon + ".png'>");
                    var tempEl = $("<h6>").append("Temp: " + response5.list[i].main.temp + '\u00B0');
                    var humidityEl = $("<h6>").append("Humidity: " + response5.list[i].main.humidity + '%');
                    var windEl = $("<h6>").append("Wind: " + response5.list[i].wind.speed + ' mph');
                    var forecast = {
                        date: response5.list[i].dt_txt.split(" ")[0],
                        icon: response5.list[i].weather[0].icon,
                        temperature: response5.list[i].main.temp,
                        humidity: response5.list[i].main.humidity,
                        wind: response5.list[i].wind.speed,
                    };
                    containerColumn.append(dateEl, iconEl, tempEl, humidityEl, windEl);
                };
                $("#forecast").append(containerColumn);
                forecastData.push(forecast);
                localStorage.setItem("forecastData", JSON.stringify(forecastData));
            };
        });
        
         function createButton() {
            var cityList = $('<button>').text(cityName);
            cityList.addClass("btn btn-secondary btn-lg btn-block");
            cityList.attr("data-city", cityName);
            $("#searchList").prepend(cityList);

        }; createButton();

        // When the button for city in the recent search list, it brings up that cities weather and forecast
        $("#searchList").on("click", function (event) {
            event.preventDefault();
            $("#forecast").empty();
            var storedCityWeatherData = JSON.parse(localStorage.getItem(event.target.textContent));
            console.log(storedCityWeatherData); 
            if (storedCityWeatherData !== null) {
                $("#cityName").text(storedCityWeatherData.city);
                $("#weatherImage").attr("src", "https://openweathermap.org/img/w/" + storedCityWeatherData.weatherImage + ".png");
                $("#temp").html(storedCityWeatherData.temperature);
                $("#humidity").html(storedCityWeatherData.humidity);
                $("#wind").html(storedCityWeatherData.wind);
            };
            // retreving the forecast data is seemingly impossible for me
            var cityForecastData = JSON.parse(localStorage.getItem(forecastData));
            cityForecastData.forecast.forEach(function(forecast) {
                var containerColumn = $("<div class='col-s-1' id='fiveDay'>");
                var dateEl = $("<h6>").append("Date: " + forecast.date);
                var iconEl = $("<h6>").append("<img src='https://openweathermap.org/img/w/" + forecast.icon + ".png'>");
                var tempEl = $("<h6>").append("Temp: " + forecast.temperature + '\u00B0');
                var humidityEl = $("<h6>").append("Humidity: " + forecast.humidity + '%');
                var windEl = $("<h6>").append("Wind: " + forecast.wind + ' mph');
                containerColumn.append(dateEl, iconEl, tempEl, humidityEl, windEl);
                $("#forecast").append(containerColumn);
            });

        });
    });
});