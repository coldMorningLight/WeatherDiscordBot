const {
  AttachmentBuilder,
  EmbedBuilder,
  Client,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const lib = require('./lib');

const { token, place, commandText, commandTextSecond, selectedLanguage } = require("./config.json");
const fs = require("fs");

const translationsRaw = fs.readFileSync("localize.json");

const urlNextDay = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${place}/next1days`;
const queryParams = new URLSearchParams({
  unitGroup: 'metric',
  lang: selectedLanguage,
  key: token,
});

const fullUrlNextDay = `${urlNextDay}?${queryParams.toString()}`;

const titles = [
  lib.getLocale(selectedLanguage, "lookToTheSkyAndSee"),
  lib.getLocale(selectedLanguage, "todaysWeatherPresents"),
  lib.getLocale(selectedLanguage, "todaysWeatherIs"),
  lib.getLocale(selectedLanguage, "todayOutsideYouCanSee"),
];

console.log("Starting...");

client.on("ready", () => {
  console.log(`the bot is online!`);
});

client.on("messageCreate", (message) => {
  // get author info
  const authorId = message.author.id;
  const authorName = message.author.username;
  console.log(`author: ${authorName}`);
  if (message.content === commandText) {
    fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
        place +
        "/today?unitGroup=metric&lang=" +
        selectedLanguage +
        "&key=" +
        token,
      {
        method: "GET",
        headers: {},
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw response; //check the http response code and if isn't ok then throw the response as an error
        }
        return response.json(); //parse the result as JSON
      })
      .then((response) => {
        //response now contains parsed JSON ready for use
        console.log(response);
        var weatherEmbed = new EmbedBuilder()
        
        weatherEmbed.setTitle(lib.rand(titles))
        .setThumbnail(`attachment://${response.currentConditions.icon}.png`)
        .setDescription(lib.buildWeatherDescription(response, selectedLanguage));

        var file = new AttachmentBuilder("");
        file = "./icons/" + response.currentConditions.icon + ".png";
        
        message.reply({ embeds: [weatherEmbed], files: [file] });
      })
      .catch((errorResponse) => {
        if (errorResponse.text) {
          errorResponse.text().then((errorMessage) => {
          });
        } else {
          //no additional error information
        }
      });
  } else if (message.content === commandTextSecond) {
    fetch(fullUrlNextDay, {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        if (!response.ok) {
          throw response; 
        }
        return response.json(); 
      })
      .then((response) => {
        console.log(response);
        var weatherNextDayEmbed = new EmbedBuilder()
          .setTitle(lib.getLocale(selectedLanguage, "tommorowWeatherIs"))
          .setThumbnail("attachment://" + response.days[1].icon + ".png")
          .setDescription(
            response.days[1].description +
              "\n" +
              lib.getLocale(selectedLanguage, "temepatureWillBe") +
              Math.round(response.days[1].feelslikemin) +
              lib.getLocale(selectedLanguage, "degreesTo") +
              Math.round(response.days[1].feelslikemax) +
              lib.getLocale(selectedLanguage, "degrees") +
              "\n",
          );
        
        var file = new AttachmentBuilder("");
        file = "./icons/" + response.days[1].icon + ".png";
        
        message.reply({ embeds: [weatherNextDayEmbed], files: [file] });
      })
      .catch((errorResponse) => {
        if (errorResponse.text) {
          errorResponse.text().then((errorMessage) => {
            console.log(errorMessage);
          });
        } else {
          //no additional error information
        }
      });
  }
});

client.login(process.env.TOKEN);
