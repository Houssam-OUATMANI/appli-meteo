"use strict";

import api from "./utils/api.js";
import { CONTAINER, FORM, INPUT } from "./utils/domElements.js";
import { round, ternaire } from "./utils/round.js";

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
const getCurrentWeatherBasedOnLocation = async (URL) => {
  try {
    const response = await fetch(URL);
    const wData = await response.json();
    return wData;
  } catch (error) {
    throw new Error(error);
  }
};

navigator.geolocation.getCurrentPosition(success, error);

const getCurrentWeatherBasedOnInput = async () => {
  const URL = `${baseName}${INPUT.value}&lang=${lang}&units=${units}&appid=${key}`;
  try {
    const response = await fetch(URL);
    const wData = await response.json();
    INPUT.value = "";
    return wData;
  } catch (error) {
    throw new Error(error);
  }
};

const displayData = (wData) => {
  CONTAINER.innerHTML = "";
  const { temp, temp_min, temp_max, feels_like, humidity } = wData.main;
  CONTAINER.innerHTML = `
  <div class="description">
  <h2>${wData.name} ${wData.sys.country}</h2>
  </div>
  <div class="details ${ternaire(temp, 12, "detail-hot", "detail-cold")}">
  <h3>${wData.weather[0].description.toUpperCase()}</h3>
  <ul>
  <li>Temperature<span class=${ternaire(temp, 12)}>${round(temp)} °C</span></li>
  <li>Minimale <span class=${ternaire(temp_min, 12)}>${round(
    temp_min
  )} °C</span> </li>
  <li>Maximale <span class=${ternaire(temp_max, 12)}>${round(
    temp_max
  )} °C</span> </li>
  <li>Ressentie <span class=${ternaire(ternaire, 12)}>${round(
    feels_like
  )} °C</span> </li>
  <li>Humidité <span >${round(humidity)} %</span></li>
  </ul>
  </div>
  `;
};

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  getCurrentWeatherBasedOnInput().then((wData) => {
    displayData(wData);
  });
});
