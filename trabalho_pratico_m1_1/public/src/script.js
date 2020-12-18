window.addEventListener("load", start);

let rangeInput = null;
let currentNumberInput = null;
let outputNumber = null;

let currentNumberValue = 0;
let outputNumberValue = "quinhentos";

let numbersDict = {
  0: "zero",
  1: "um",
  2: "dois",
  3: "três",
  4: "quatro",
  5: "cinco",
  6: "seis",
  7: "sete",
  8: "oito",
  9: "nove",
  10: "dez",
  11: "onze",
  12: "doze",
  13: "treze",
  14: "quatorze",
  15: "quinze",
  16: "dezesseis",
  17: "dezessete",
  18: "dezoito",
  19: "dezenove",
  20: "vinte",
  30: "trinta",
  40: "quarenta",
  50: "cinquenta",
  60: "sessenta",
  70: "setenta",
  80: "oitenta",
  90: "noventa",
  100: "cem",
  200: "duzentos",
  300: "trezentos",
  400: "quatrocentos",
  500: "quinhentos",
  600: "seiscentos",
  700: "setecentos",
  800: "oitocentos",
  900: "novecentos",
};

function start() {
  rangeInput = document.querySelector("#inNumberRange");
  currentNumberInput = document.querySelector("#inNumber");
  outputNumber = document.querySelector("#outNumberTxt");

  rangeInput.addEventListener("input", handleRangeInput);

  rangeInput.value = 500;
  currentNumberValue = rangeInput.value;

  render();
}

function handleRangeInput() {
  currentNumberValue = rangeInput.value;
  if (rangeInput.value < 10) {
    outputNumberValue = handleSingleDigit(rangeInput.value);
  } else if (rangeInput.value < 100) {
    outputNumberValue = handleDoubleDigit(rangeInput.value);
  } else {
    outputNumberValue = handleTripleDigit(rangeInput.value);
  }
  render();
}

function handleSingleDigit(input) {
  let value = parseInt(input);
  return numbersDict[value];
}

function handleDoubleDigit(input) {
  let value = parseInt(input);
  if (value <= 20) {
    return numbersDict[value];
  }

  let firstDigit = value.toString().charAt(0);
  let secondDigit = value.toString().charAt(1);

  if (secondDigit == 0) {
    return numbersDict[value];
  } else {
    let tempValue = firstDigit + "0";
    return numbersDict[parseInt(tempValue)] + " e " + numbersDict[secondDigit];
  }
}

function handleTripleDigit(value) {
  let firstDigit = value.charAt(0);
  let secondDigit = value.charAt(1);
  let thirdDigit = value.charAt(2);

  let centena = firstDigit + "00";
  let dezena = secondDigit + "0";

  if (value == 100) {
    return numbersDict[100];
  }

  if (firstDigit == 1 && value != 100) {
    return "cento e " + handleDoubleDigit(secondDigit + thirdDigit);
  } else if (secondDigit == 0 && thirdDigit == 0) {
    return numbersDict[centena];
  } else {
    return (
      numbersDict[centena] + " e " + handleDoubleDigit(secondDigit + thirdDigit)
    );
  }
}

function render() {
  outputNumberValue =
    outputNumberValue.charAt(0).toUpperCase() + outputNumberValue.slice(1);

  currentNumberInput.value = currentNumberValue;
  outputNumber.value = outputNumberValue;

  if (outputNumberValue.includes("undefined")) {
    alert("Erro no numero: " + currentNumberValue);
  }
}
