const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbersOfBanks = [
    24900005, 24901015, 24901028, 24901031, 24901044, 24901057, 10600005, 10600018, 10600021, 10600034, 10600047, 10600050,
    10600063, 10600076, 10600089, 10600092, 10600106, 10600119, 10600122, 10600135, 10600148, 10600151, 10600164, 10600177,
    10600180, 10600193, 10600207, 10600249, 10600252, 10600265, 10300006, 10300019, 10300022, 10301016, 10301029, 10301032,
    10301045, 10301058, 10301061, 10301074, 10301087, 10301090, 10301104, 10301117, 10301120, 10301133, 1030114610301159,
    10301162, 10301175, 10301188, 10301191, 10301205, 10301218, 11600006, 11602202, 11602215, 11602228, 11602231, 11602244,
    15400004, 15400017, 15400020, 15401014, 15401027, 15401030, 15401043, 15401056, 15401069, 15401072, 15401085, 15401098,
    15401102, 15401115, 15401128, 15401131, 15401144, 15401157, 12400001, 12400027, 12400030, 12400043, 12400056, 12400069,
    12401011, 12401024, 12401037, 12401040, 12401053, 12401066, 12401079, 12401082, 12401095, 12401109, 12401112, 12401125,
    10900004, 10900020, 10900033, 10900046, 10900059, 10900075, 10901014, 10901030, 10901043, 10901056, 10901069, 10901072,
    10901098, 10901102, 10901115, 10901128, 10901131, 10901144, 11400000, 11401010, 11401023, 11401036, 11401049, 11401052,
    11401065, 11401078, 11401081, 11401094, 11401108, 11401111, 11401124, 11401137, 11401140, 11401153, 11401166, 11401179,
    18800009, 18801019, 18801022, 10101397, 10101401, 10101469, 15600000, 15600013, 15601010, 15601023, 15601049, 15601081,
    15601094, 15601108, 15601111, 15601137, 15601140, 15601166, 15601195, 10500002, 10500015, 10500028, 10500031, 10500044,
    10500057, 10500060, 10500073, 10500086, 10500099, 10500103, 10500116, 10500129, 10500132, 10500145, 10500158, 10500161,
    10501012, 19400008, 19401063, 19401076, 19401177, 19401180, 19401193, 19401207, 19401210, 10100000, 10100039, 10100055,
    10100068, 10100071, 10101010, 10101023, 10101049, 10101078, 10101140, 10101212, 10101238, 10101270, 10101339, 10101371
];

function getDataFromJson(fileName, key, mapData = true) {
    const url = chrome.runtime.getURL(`./assets/${fileName}.json`);

    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            resolve(mapData ? myJson[`${key}s`].map(m => (m[key].toLowerCase())) : myJson)
        }).catch(err => reject(err))
    })
}

function generateNRB(el, valid) {
    let nrb;
    const bankId = numbersOfBanks[Math.floor(Math.random() * numbersOfBanks.length)];
    let accountNrb = '';
    for (let i = 0; i < 16; i++) {
        accountNrb += randChars(false);
    }
    nrb = valid ? getControlNrbNumber(bankId + accountNrb + '252100') : (randChars(false) + randChars(false));
    nrb += bankId + accountNrb;
    el.value = nrb;
    el.dispatchEvent(new Event('input'));
}

function generateIBAN(el, valid) {
    this.generateNRB(el, valid);
    el.value = 'PL' + el.value;
    el.dispatchEvent(new Event('input'));
}

function randomPhoneNumber(el, valid) {
    let value = '';

    for (let i = 0; i < 9; i++) {
        value += randChars(false);
    }

    el.value = valid ? value : '+48' + value;
    el.dispatchEvent(new Event('input'));
}

function randomPostalCode(el, valid) {
    let value = '';

    for (let i = 0; i < (valid ? 2 : 3); i++) {
        value += randChars(false);
    }

    value += '-';

    for (let i = 0; i < 3; i++) {
        value += randChars(false);
    }

    el.value = value;
    el.dispatchEvent(new Event('input'));
}

function getControlNrbNumber(number) {
    let prefixForPartTwo = number.slice(0, 10) % 97;
    let prefixForPartThree = (prefixForPartTwo + number.slice(10, 20)) % 97;
    let modulo = (prefixForPartThree + number.slice(20, 30)) % 97;
    let result = String(98 - modulo);

    if (result.length < 2) {
        result = 0 + result;
    }

    return result;
}

function generatePesel(element, valid = true) {
    const date = randomDate(new Date(1900), new Date());
    const checkSumControl = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let checkSum = 0;
    let value = '';
    value += date.year.toString().slice(2);
    if (date.year >= 2000) {
        value += date.month > 10 ? ('3' + date.month.slice(0, 1)) : ('2' + date.month);
    } else {
        value += date.month < 10 ? ('0' + date.month) : date.month;
    }
    value += date.day < 10 ? ('0' + date.day) : date.day;

    for (let i = 0; i < 4; i++) {
        value += randChars(false);
    }

    for (let i = 0; i < value.length; i++) {
        const sum = (chars.findIndex(f => f == value[i]) * checkSumControl[i]).toString();
        checkSum += sum.length > 1 ? Number(sum.slice(1)) : Number(sum);
    }
    value += valid ? (checkSum > 10 ? (10 - Number(checkSum.toString().slice(1))) : checkSum == 10 ? 0 : (10 - checkSum)) : '0';
    element.value = value;
    element.dispatchEvent(new Event('input'));
}

function randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return {
        year: date.getFullYear(date),
        month: date.getMonth(),
        day: date.getDay()
    }
}

function identityCardNumber(elem, valid = true) {
    const checkSumControl = [7, 3, 1, 7, 3, 1, 7, 3];
    let checkSum = 0;
    let value = '';

    for (let i = 0; i < 8; i++) {
        value += i < 3 ? randChars(true) : randChars(false);
        checkSum += chars.findIndex(f => f == value[i]) * checkSumControl[i];
    }

    checkSum = checkSum % 10;
    elem.value = value.slice(0, 3).toUpperCase() + (valid ? checkSum : checkSum + 1) + value.slice(3);
    elem.dispatchEvent(new Event('input'));
}

function generateNip(elem, valid = true) {
    let value = '';
    let checkSum = 0;
    const checkSumControls = [6, 5, 7, 2, 3, 4, 5, 6, 7];

    for (let i = 0; i < 9; i++) {
        const number = randChars(false)
        value += number;
        checkSum += Number(number) * checkSumControls[i];
    }
    elem.value = valid ? value + checkSum % 11 : value + 0;
    elem.dispatchEvent(new Event('input'));
}

function randChars(letters = false) {
    return letters ? chars.slice(10)[Math.floor(Math.random() * chars.slice(10).length)] :
        chars.slice(0, 9)[Math.floor(Math.random() * chars.slice(0, 9).length)];
}

function randomNameOrSurname(element, female, name) {
    let dataFileName = female ? 'female' : 'male';
    name ? dataFileName = dataFileName : dataFileName += '-surname';

    getDataFromJson(dataFileName, name ? 'name' : 'surname').then(data => {
        const randomIndex = Math.floor(Math.random() * data.length)
        element.value = data[randomIndex][0].toUpperCase() + data[randomIndex].slice(1);
        element.dispatchEvent(new Event('input'));
    }).catch(err => console.log(err))
}

function randomValue(element, text) {
    const maxLength = checkMaxLength(element);

    if (text) {
        getDataFromJson('lorem', 'name', false).then(data => {
            element.value = maxLength ? data['text'].slice(0, maxLength) : data['text'];
        }).catch(err => console.log(err))
    } else {
        let value = '';
        for (let index = 0; index < (maxLength ? maxLength : Math.floor(Math.random() * (7 - 1 + 1) + 1)); index++) {
            value += randChars();
        }
        element.value = value;
    }

    element.dispatchEvent(new Event('input'));
}

function getCity(element) {
    const maxLength = checkMaxLength(element);

    getDataFromJson('cities', 'cities', false).then(data => {
        data = data.cities;
        data = data.map(d => d.name);
        data = data && maxLength > 0 ? data.filter(c => c.length <= maxLength) : data;
        const randomIndex = Math.floor(Math.random() * data.length)
        element.value = data[randomIndex];
        element.dispatchEvent(new Event('input'));
    }).catch(err => console.log(err))
}

function checkMaxLength(element) {
    return element && element.maxLength > 0 ? element.maxLength : 0;
}

chrome.runtime.onMessage.addListener((message) => {
    const element = document.activeElement;

    const item = message.slice(0, 1);
    const valid = message.slice(1) == 'valid';

    switch (item) {
        case '1':
            generatePesel(element, valid);
            break;
        case '2':
            identityCardNumber(element, valid);
            break;
        case '3': {
            element.value = element.defaultValue;
            element.dispatchEvent(new Event('input'));
            break;
        }
        case '4': {
            for (let i = 0; i < document.forms.length; i++) {
                document.forms[i].reset();
            }
            break;
        }
        case '5':
            generateNip(element, valid);
            break;
        case '6':
            generateNRB(element, valid);
            break;
        case '7':
            generateIBAN(element, valid);
            break;
        case '8':
            randomNameOrSurname(element, valid, true);
            break;
        case '9':
            randomNameOrSurname(element, valid, false);
            break;
        case '0':
            randomValue(element, valid);
            break;
        case 'p':
            randomPhoneNumber(element, valid);
            break;
        case 'k':
            randomPostalCode(element, valid);
            break;
        case 'c':
            getCity(element);
            break;
    }
});