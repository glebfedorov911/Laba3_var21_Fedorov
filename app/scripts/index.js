

const CONVERTER = 9.461e+12;
const BAD_VALUE_INPUT = "Введенное значение не корректно";
const BAD_INPUT_CONVERTER_TYPE = "Введено неизвестное значение конвертации";
const INPUT_VALUE_TOO_LARGE = "Вы ввели слишком большое число";
const LIGHT_YEAR_TO_KILOMETER = "light-year-to-kilometer";
const KILOMETER_TO_LIGHT_YEAR = "kilometer-to-light-year";
const CONVERTER_TO_TABLE_VALUE = {
    "light-year-to-kilometer": "Световые года",
    "kilometer-to-light-year": "Километры",
};

let inputValue = document.querySelector("#input-value");
let buttonConvert = document.querySelector("#button");
let table = document.querySelector("#results");
let options = document.querySelector("#select-type");
let postResult = document.querySelector("#post-result");
let history = new Object();

inputValue.addEventListener("input", function(e) {
    try {
        postResult.textContent = convertTo(inputValue, options.value);
    } catch (e) {
        setInputValueAndPostResultEmpty();
    }
})

options.addEventListener("change", function(e) {
    try {
            postResult.textContent = convertTo(inputValue, options.value);
    } catch (e) {
        setInputValueAndPostResultEmpty();
    }
})

buttonConvert.addEventListener("click", function(e) {
    try {
        convert(options, inputValue);
    }
    catch (e) {
        alert(e);
    }
    setInputValueAndPostResultEmpty();
})

function convert(options, inputValue) {
    if (options.value === LIGHT_YEAR_TO_KILOMETER) {
        convertValueAndSaveToTable(
            inputValue,
            LIGHT_YEAR_TO_KILOMETER,
            KILOMETER_TO_LIGHT_YEAR,
        );
    } else if (options.value === KILOMETER_TO_LIGHT_YEAR) {
        convertValueAndSaveToTable(
            inputValue,
            KILOMETER_TO_LIGHT_YEAR,
            LIGHT_YEAR_TO_KILOMETER,
        );
    } else {
        throw new Error(BAD_INPUT_CONVERTER_TYPE);
    }
}

function convertValueAndSaveToTable(inputValue, typeIn, typeOut) {
    output = convertTo(inputValue, typeIn);

    checkOutputOnInfinity(output);

    addValueToTable(
        Number(inputValue.value),
        output,
        CONVERTER_TO_TABLE_VALUE[`${typeIn}`],
        CONVERTER_TO_TABLE_VALUE[`${typeOut}`],
    )
}

function convertTo(input, typeIn) {
    setEmptyIfInputIsEmpty(input);

    return (
    typeIn == LIGHT_YEAR_TO_KILOMETER
    ? convertLightYearToKilometer(input)
    : convertKilometerToLightYear(input)
    );
}

function setEmptyIfInputIsEmpty(input) {
    if (input === "") {
        setInputValueAndPostResultEmpty();
    }
}

function setInputValueAndPostResultEmpty() {
    inputValue.value = "";
    postResult.textContent = "";
}

function convertLightYearToKilometer(letLightYear) {
    let lightYear = convertInputValueToNumber(letLightYear.value);
    let kilometer = CONVERTER * lightYear;
    return kilometer;
}

function convertKilometerToLightYear(letKilometer) {
    let kilometer = convertInputValueToNumber(letKilometer.value);
    let lightYear =  kilometer / CONVERTER;
    return lightYear;
}

function convertInputValueToNumber(inputValue) {
    let number = Number(inputValue);
    if (isNaN(number)
    || number < 0
    || inputValue === "") {
        throw new Error(BAD_VALUE_INPUT);
    } else {
        return number;
    }
}

function checkOutputOnInfinity(input, output) {
    if (output === Infinity || input === Infinity) {
        throw new Error(INPUT_VALUE_TOO_LARGE);
    }
}

function addValueToTable(inputValue, outputValue, typeIn, typeOut) {
    let valueToTable = {inputValue, outputValue, typeIn, typeOut};

    let resultToSave = Object.values(valueToTable).join(" ");
    if (checkHistory(resultToSave)) {
        return;
    }
    saveHistory(resultToSave);

    let tr = document.createElement("tr");
    let td;
    for (i in valueToTable) {
        td = document.createElement("td");
        td.textContent = valueToTable[i];
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

function checkHistory(key) {
    return history[key];
}

function saveHistory(key) {
    history[key] = true;
}