import { promises } from "fs";
import axios from "axios";

function getStatePath(stateName) {
  return `./states/${stateName}.json`;
}

async function main() {
  await saveToStatesFiles(); //Função 1

  console.log("#################################################");
  console.log("FUNÇÃO 2");
  console.log(`Numero de cidades em TO: ${await getCityCount("TO")}`); //Função 2
  console.log(" ");

  let { printableArrayFiveMost, printableArrayFiveLess } = await getFiveMostAndLessCities();

  console.log("#################################################");
  console.log("FUNÇÃO 3");
  console.log(printableArrayFiveMost); // Função 3
  console.log(" ");

  console.log("#################################################");
  console.log("FUNÇÃO 4");
  console.log(printableArrayFiveLess); // Função 4
  console.log(" ");

  let { biggestName, smallestName, biggestOfAll, smallestOfAll } = await getBiggestAndSmallestCityName();

  console.log("#################################################");
  console.log("FUNÇÃO 5");
  console.log(biggestName); //Função 5
  console.log(" ");

  console.log("#################################################");
  console.log("FUNÇÃO 6");
  console.log(smallestName); //Função 6
  console.log(" ");

  console.log("#################################################");
  console.log("FUNÇÃO 7");
  console.log(biggestOfAll); //Função 7
  console.log(" ");

  console.log("#################################################");
  console.log("FUNÇÃO 8");
  console.log(smallestOfAll); //Função 8
  console.log(" ");
}


// Função 1
async function saveToStatesFiles() {
  const { cities, states } = await getJson();
  let statesNames = [];

  for (let state of states) {
    statesNames.push(state.Sigla);
    const uf_file_name = state.Sigla;
    const uf_city_list = cities.filter((city) => {
      return city.Estado === state.ID;
    });
    await promises.writeFile(
      `./states/${uf_file_name}.json`,
      JSON.stringify(uf_city_list)
    );
  }
  await promises.writeFile(getStatePath("StatesNames"), JSON.stringify(statesNames));
}

//Função 2
async function getCityCount(stateName) {
  let cities = await getStateFile(stateName);
  return cities.length;
}

//Função 3 e 4
async function getFiveMostAndLessCities() {
  let statesNamesList = await getStatesNamesList();
  let ufAndCountList = await Promise.all(statesNamesList.map(async (stateName) => {
    let citiesCount = await getCityCount(stateName);
    return { stateName, citiesCount };
  }));

  ufAndCountList.sort((a, b) => {
    return b.citiesCount - a.citiesCount;
  });

  let printableArrayFiveMost = [];
  for (let i = 0; i < 5; i++) {
    //console.log(`${ufAndCountList[i].stateName} - ${ufAndCountList[i].citiesCount}`);
    printableArrayFiveMost.push(`${ufAndCountList[i].stateName} - ${ufAndCountList[i].citiesCount}`);
  }

  ufAndCountList.sort((a, b) => {
    return a.citiesCount - b.citiesCount;
  });

  let fiveLessDecrescente = [];
  for (let i = 0; i < 5; i++) {
    fiveLessDecrescente.push(ufAndCountList[i]);
  }

  fiveLessDecrescente.sort((a, b) => {
    return b.citiesCount - a.citiesCount;
  })

  let printableArrayFiveLess = [];
  for (let i = 0; i < 5; i++) {
    printableArrayFiveLess.push(`${fiveLessDecrescente[i].stateName} - ${fiveLessDecrescente[i].citiesCount}`);
  }

  return { printableArrayFiveMost, printableArrayFiveLess };
}

//Função 5
async function getBiggestAndSmallestCityName() {
  let statesNamesList = await getStatesNamesList();

  let biggestName = [];
  let smallestName = [];

  let allBiggestName = [];
  let allSmallestName = [];

  for (let stateName of statesNamesList) {
    let allCities = await getStateFile(stateName);

    allCities.sort((a, b) => b.Nome.length - a.Nome.length);
    biggestName.push(`${allCities[0].Nome} - ${stateName}`);
    allBiggestName.push({ UF: stateName, city: allCities[0].Nome });

    allCities.sort((a, b) => a.Nome.length - b.Nome.length);
    smallestName.push(`${allCities[0].Nome} - ${stateName}`);
    allSmallestName.push({ UF: stateName, city: allCities[0].Nome });
  }

  allBiggestName.sort((a, b) => b.city.length - a.city.length);
  allSmallestName.sort((a, b) => a.city.length - b.city.length);

  const biggestOfAll = `${allBiggestName[0].city} - ${allBiggestName[0].UF}`;
  const smallestOfAll = `${allSmallestName[0].city} - ${allSmallestName[0].UF}`;
  return { biggestName, smallestName, biggestOfAll, smallestOfAll };
}

async function getStateFile(stateName) {
  const stateFile = await promises.readFile(`./states/${stateName}.json`);
  const cities = JSON.parse(stateFile);
  return cities;
}

async function getJson() {
  const cities_res = await axios.get(
    "http://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/master/Cidades.json"
  );
  const states_res = await axios.get(
    "https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/master/Estados.json"
  );
  const cities = cities_res.data;
  const states = states_res.data;
  return { cities, states };
}


async function getStatesNamesList() {
  const list = await promises.readFile(getStatePath("StatesNames"));
  return JSON.parse(list);
}

await main();
