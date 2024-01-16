const fs = require("fs");
const translationsRaw = fs.readFileSync("localize.json");
const selectedLanguage = "pl";
let strings = JSON.parse(translationsRaw);

function buildWeatherDescription(response, selectedLanguage) {
    const description = [
        response.days[0].description,
        "\n\n",
        getLocale(selectedLanguage, "weatherConditionsAre"),
        response.currentConditions.conditions,
        " \n\n",
        getLocale(selectedLanguage, "temperatureIs"),
        Math.round(response.currentConditions.feelslike),
        getLocale(selectedLanguage, "degrees"),
        "\n",
        getLocale(selectedLanguage, "windSpeedIs"),
        windSpeedTo(response.currentConditions.windspeed),
        ` (${response.currentConditions.windspeed} km/h)`,
        "\n",
        getLocale(selectedLanguage, "sunriseTime"),
        response.currentConditions.sunrise.slice(0, -3),
        "\n",
        getLocale(selectedLanguage, "sunsetTime"),
        response.currentConditions.sunset.slice(0, -3),
        "\n",
        getLocale(selectedLanguage, "moonphase"),
        moonPhase(response.currentConditions.moonphase),
        ` (${moonphaseToPercentage(response.currentConditions.moonphase)}%)`
    ].join("");

    return description;
}


function moonPhase(number) {
  var result = "";
  if (number === 0) {
    result = getLocale(selectedLanguage, "fullMoon");
  } else if (number < 0 && number < 0.25) {
    result = getLocale(selectedLanguage, "waxingCrescentMoon");
  } else if (number === 0.25) {
    result = getLocale(selectedLanguage, "firstQuarterMoon");
  } else if (number < 0.25 && number < 0.5) {
    result = getLocale(selectedLanguage, "waningCrescentMoon");
  } else if (number === 0.5) {
    result = getLocale(selectedLanguage, "newMoon");
  } else if (number < 0.5 && number < 0.75) {
    result = getLocale(selectedLanguage, "waningCrescentMoon");
  } else if (number === 0.75) {
    result = getLocale(selectedLanguage, "thirdQuaterMoon");
  } else if (number > 0.75 && number <= 1) {
    result = getLocale(selectedLanguage, "wanningGibbousMoon");
  }

  return result;
}

function rand(items) {
  // "~~" for a closest "int"
  return items[~~(items.length * Math.random())];
}

function windSpeedTo(wind) {
  var description = "";

  if (wind <= 1.5) {
    description = getLocale(selectedLanguage, "calm");
  } else if (wind > 1.5 && wind <= 5) {
    description = getLocale(selectedLanguage, "lightAir");
  } else if (wind > 5 && wind <= 11) {
    description = getLocale(selectedLanguage, "lightBreeze");
  } else if (wind > 11 && wind <= 19) {
    description = getLocale(selectedLanguage, "gentleBreeze");
  } else if (wind > 19 && wind <= 29) {
    description = getLocale(selectedLanguage, "moderateBreeze");
  } else if (wind > 29 && wind <= 39) {
    description = getLocale(selectedLanguage, "freshBreeze");
  } else if (wind > 39 && wind <= 50) {
    description = getLocale(selectedLanguage, "strongBreeze");
  } else if (wind > 50 && wind <= 61) {
    description = getLocale(selectedLanguage, "nearGale");
  } else if (wind > 61 && wind <= 74) {
    description = getLocale(selectedLanguage, "gale");
  } else if (wind > 74 && wind <= 87) {
    description = getLocale(selectedLanguage, "strongGale");
  } else if (wind > 87 && wind <= 101) {
    description = getLocale(selectedLanguage, "storm");
  } else if (wind > 101 && wind <= 120) {
    description = getLocale(selectedLanguage, "violentStorm");
  } else if (wind > 120) {
    description = getLocale(selectedLanguage, "hurricane");
  }

  return description;
}

function moonphaseToPercentage(moonphase) {
  var percentage = 0;

  if (moonphase <= 0.5) {
    percentage = moonphase * 100 * 2;
  } else if (moonphase > 0.5) {
    percentage = (moonphase - 0.5) * 100 * 2;
  }

  return Math.round(percentage);
}

function getLocale(language, string, ...vars) {
  let locale = strings[language][string];

  let count = 0;
  locale = locale.replace(/%VAR%/g, () =>
    vars[count] !== null ? vars[count] : "%VAR%",
  );

  return locale;
}

module.exports = { moonphaseToPercentage, buildWeatherDescription, rand, windSpeedTo, getLocale };
