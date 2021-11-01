import api from "./utils/api.js";
import { CONTAINER, FORM, INPUT } from "./utils/domElements.js";
import { round } from "./utils/round.js";

const { baseName, baseCoords, key, lang, units } = api;

/**
 *
 * @param {GeolocationPosition} position
 */
const success = (position) => {
  const {
    coords: { latitude, longitude },
  } = position;

  const URL = `${baseCoords}${latitude}&lon=${longitude}&lang=${lang}&units=${units}&appid=${key}`;
  getCurrentWeatherBasedOnLocation(URL).then((wData) => displayData(wData));
};

const error = (error) => {
  CONTAINER.innerHTML = `<div class="details">
    <h2 style="text-align:center;">You need to Enable Location</h2>
 </div>`;
};

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  getCurrentWeatherBasedOnInput().then((wData) => {
    displayData(wData);
  });
});
navigator.geolocation.getCurrentPosition(success, error);

const getCurrentWeatherBasedOnLocation = async (URL) => {
  const response = await fetch(URL);
  const wData = await response.json();
  return wData;
};

const getCurrentWeatherBasedOnInput = async () => {
  const URL = `${baseName}${INPUT.value}&lang=${lang}&units=${units}&appid=${key}`;
  const response = await fetch(URL);
  const wData = await response.json();
  INPUT.value = "";
  return wData;
};
const displayData = (wData) => {
  CONTAINER.innerHTML = "";
  const { temp, temp_min, temp_max, feels_like, humidity } = wData.main;
  CONTAINER.innerHTML += `
        <div class="description">
            <h2>${wData.name} ${wData.sys.country}</h2>
        </div>
        <div class="details ${temp > 32 ? "detail-hot" : "detail-cold"}">
            <h3>${wData.weather[0].description.toUpperCase()}</h3>
            <ul>
                <li>Temperature <span class=${
                  temp > 12 ? "hot" : "cold"
                }> ${round(temp)} °C</span> </li>
                <li>Minimale <span class=${
                  temp_min > 12 ? "hot" : "cold"
                }>${round(temp_min)} °C</span> </li>
                <li>Maximale <span class=${
                  temp_max > 12 ? "hot" : "cold"
                }>${round(temp_max)} °C</span> </li>
                <li>Ressenti <span class=${
                  feels_like > 12 ? "hot" : "cold"
                }>${round(feels_like)} °C</span> </li>
                <li>Humidité <span >${round(humidity)} %</span></li>
            </ul>
        </div>
    `;
};
