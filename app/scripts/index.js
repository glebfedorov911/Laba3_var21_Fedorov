

const CONVERTER = 9.461e+12;
const BAD_VALUE_INPUT = "Введенное значение не корректно";
const BAD_INPUT_CONVERTER_TYPE = "Введено неизвестное значение конвертации";
const INPUT_VALUE_TOO_LARGE = "Вы ввели слишком большое число";
const WAS_IN_HISTORY = "Значение уже было использовано";
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
    updateInRealTime();
})

options.addEventListener("change", function(e) {
    updateInRealTime();
})

buttonConvert.addEventListener("click", function(e) {
    saveInTable();
})

/**
 * Метод обновления в реальном времени значений в поле пост-результата

 * @return {void}
**/
function updateInRealTime() {
    try {
        postResult.textContent = convertTo(inputValue, options.value);
    } catch (e) {
        setInputValueAndPostResultEmpty();
    }
}


/**
 * Метод сохранения в таблицу (по событию нажатия кнопки).
 *
 * @returns {void}
 */
function saveInTable() {
    try {
        convert(options, inputValue);
    }
    catch (e) {
        alert(e);
    }
    setInputValueAndPostResultEmpty();
}


/**
 * Конвертация по типу и сохранение в таблицу.
 *
 * @param {string} options - option с типом данных в html
 * @param {string} inputValue - введенное пользователем значение
 * @throw {Error} Неверный тип конвертации
 * @return {void}
 */
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


/**
 *  Вспомогательная функция для convert. Конвертация значений и сохранение в таблицу.
 *
 * @param {string} inputValue - значение введеное пользователем
 * @param {string} typeIn - тип введенных значений
 * @param {string} typeOut - тип рассчитанного значения значений
 * @returns {void}
 */
function convertValueAndSaveToTable(inputValue, typeIn, typeOut) {
    output = convertTo(inputValue, typeIn);

    checkOutputInputOnInfinity(output);

    addValueToTable(
        Number(inputValue.value),
        output,
        CONVERTER_TO_TABLE_VALUE[`${typeIn}`],
        CONVERTER_TO_TABLE_VALUE[`${typeOut}`],
    );
}

/**
 * Конвертация значений по введенному типу.
 *
 * @param {string} input - значение введеное пользователем
 * @param {string} typeIn - тип введенных значений
 * @returns {number} конвертированное значение
 */
function convertTo(input, typeIn) {
    setEmptyIfInputIsEmpty(input);

    return (
    typeIn == LIGHT_YEAR_TO_KILOMETER
    ? convertLightYearToKilometer(input)
    : convertKilometerToLightYear(input)
    );
}

/**
 * Проверка на пустоту и очистка значений.
 *
 * @param {string} input - значение в поле
 * @returns {void}
 */
function setEmptyIfInputIsEmpty(input) {
    if (input === "") {
        setInputValueAndPostResultEmpty();
    }
}

/**
 * Очистка полей ввода.
 *
 * @returns {void}
 */
function setInputValueAndPostResultEmpty() {
    inputValue.value = "";
    postResult.textContent = "";
}

/**
 * Функция конвертации свет. лет в киломенты.
 *
 * @param {string} letLightYear - переменная в которой хранятся свет. годы
 * @returns {number} - конвертированное значение
 */
function convertLightYearToKilometer(letLightYear) {
    let lightYear = convertInputValueToNumber(letLightYear.value);
    let kilometer = CONVERTER * lightYear;
    return kilometer;
}

/**
 * Функция конвертации километров в свет. года.
 *
 * @param {string} letKilometer - переменная в которой хранятся километры
 * @returns {number} - конвертированное значение
 */
function convertKilometerToLightYear(letKilometer) {
    let kilometer = convertInputValueToNumber(letKilometer.value);
    let lightYear =  kilometer / CONVERTER;
    return lightYear;
}

/**
 * Функция конвертации значения в число.
 *
 * @param {string} inputValue - введеное значение пользователем
 * @throw {Error} Исключение: введено некорректное значение.
 * @returns {number} Возваращает преобразованное число
 */
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

/**
 * Функция проверки введенного и рассчитанного значения на бесконечность.
 *
 * @param {string} input - введенное значение пользователем
 * @param {string} output - рассчитанное значение
 * @throw {Error} Исключение: значение слишком большое.
 * @returns {void}
 */
function checkOutputInputOnInfinity(input, output) {
    if (output === Infinity || input === Infinity) {
        throw new Error(INPUT_VALUE_TOO_LARGE);
    }
}

/**
 * Функция добавления кода в html-таблицу.
 *
 * @param {string} inputValue - введенное значение пользователем
 * @param {string} outPut - рассчитанное значение
 * @param {string} typeIn - тип введенного значения
 * @param {string} inputValue - тип расчитанного значения
 * @returns {void}.
 */
function addValueToTable(inputValue, outputValue, typeIn, typeOut) {
    let valueToTable = {inputValue, outputValue, typeIn, typeOut};

    let resultToSave = Object.values(valueToTable).join(" ");
    if (checkHistory(resultToSave)) {
        alert(WAS_IN_HISTORY)
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

/**
 * Функция возврата значения из истории.
 *
 * @param {string} key - Ключ, который хранится в объекте
 * @returns {bool} - Функция возвращает ключ из истории.
 */
function checkHistory(key)  {
    return history[key];
}

/**
 * Сохраняет ключ в объекте истории, отмечая его как true.
 *
 * @param {string} key - Ключ, который нужно сохранить в истории.
 * @returns {void} - Функция не возвращает значение.
 */
function saveHistory(key) {
    history[key] = true;
}