const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

require('dotenv').config();
const apiKey= process.env.API_KEY;

const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index", { weather: null, description: null, weatherUrl: null, error: null });
});

app.post("/", function (req, res) {

    const query = req.body.cityName;
    // const apiKey = "4a7186d8e4d2a88cde1d1457ad860d78";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    https.get(url, function (response) {

        console.log(response.statusCode);


        response.on("data", function (data) {

            const weatherData = JSON.parse(data);

            // console.log(weatherData);

            if (response.statusCode === 404) {
                res.render("index", { weather: null, description: null, weatherUrl: null, error: weatherData.message })
            }
            else if(response.statusCode != 200)
            {
                res.render("index", { weather: null, description: null, weatherUrl: null, error: "Error, please try again!" })
            }
            else {

                const temperature = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

                console.log(temperature);
                console.log(description);

                // res.write("<h1>The temperature in " + query + " is " + temperature + " degrees Celsius.</h1>");
                // res.write("<h3>The weather is currently " + description + "</h3>");
                // res.write(" <img src=" + imageUrl + "> ");
                // res.send();

                const weatherText = "The temperature in " + query + " is " + temperature + " degrees Celsius.";
                const weatherDescription = "The weather is currently " + description;
                res.render("index", { weather: weatherText, description: weatherDescription, weatherUrl: imageUrl, error: null });
            }

        });
    });
})

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
}); 