var tempLanguage = window.navigator.userLanguage || window.navigator.language;
var language = 'English';
switch (tempLanguage) {
    case "ko":
    case "ko-KR":
        var language = 'Korean';
        break;
    default:
        var language = "English";
        break;
}

var memo_meari = null;
var memo_n = null;
var memo_cost = null;

const menu_meari = [60, 194, 320, 723, 2123, 3498, 6918]
const menu_string = ["60 + 0", "185 + 9", "305 + 15", "690 + 33", "2025 + 98", "3330 + 168", "6590 + 328"]
const l = menu_meari.length;

const trans = {
    'English': {
        'string': ['Identity V Echoes calculator', 'Write the amount of Echoes', 'Calculate', 'Echoes', 'Cost', 'Amount'],
        'result': function(meari, n, cost) {
            return `Total ${meari} Echoes (+${meari-n}) for ${cost}USD`
        },
        'invalid': 'Please enter the natural number',
        'menu_price': [0.99, 2.99, 4.99, 9.99, 29.99, 49.99, 99.99],
        'decimal': 2,
        'confirm': 'More than 999,999 Echoes can be slow'
    },
    'Korean': {
        'string': ['제5인격 메아리 계산기', '메아리의 양을 입력하세요', '계산하기', '메아리', '가격', '수량'],
        'result': function(meari, n, cost) {
            return `${cost}원에 총 ${meari} 메아리 (+${meari-n})`
        },
        'invalid': '자연수를 입력해 주세요',
        'menu_price': [1200, 3900, 5900, 14000, 39000, 65000, 119000],
        'decimal': 0,
        'confirm': '백만 이상의 메아리는 느릴 수도 있어요'
    }
}

function optimize(n) {
    var data = Array(n + menu_meari[l - 1] + 1).fill(null).map(() => [Array(l).fill(Infinity), Infinity]);
    data[0] = [Array(l).fill(0), 0];

    for (let current = 0; current < n + 1; current++) {
        const comb = data[current][0].slice();
        const cost = data[current][1];
        for (let i = 0; i < l; i++) {
            var comb_new = comb.slice();
            comb_new[i] += 1;
            var cost_new = cost + trans[language]['menu_price'][i];
            if (cost_new <= data[current + menu_meari[i]][1]) {
                data[current + menu_meari[i]] = [comb_new, cost_new]
            }
        }
    }
    var solution = data.slice(n, n + menu_meari[l - 1] + 1).sort((a, b) => a[1] - b[1])[0];
    solution[1] = solution[1].toFixed(trans[language]['decimal']);
    var meari = 0;
    solution[0].forEach((elem, index) => {
        meari += elem * menu_meari[index]
    });
    return [
        solution[0],
        solution[1],
        [meari]
    ]
}

function process(number = null) {
    var value = document.getElementById('input').value
    var n = parseInt(value)
    if (!isNaN(n) && n >= 0 && n === parseFloat(value)) {
        if (n >= 1000000) {
            var accept = confirm(trans[language]['confirm']);
            if (!(accept)) {
                return
            }
        }
        var [comb, cost, meari] = optimize(n);
        [memo_meari, memo_n, memo_cost] = [meari, n, cost];
        document.getElementById('result').innerHTML = trans[language]['result'](meari, n, cost);
        var rows = document.getElementById('table').rows;
        for (var i = 0; i < rows.length - 1; i++) {
            rows[i + 1].cells[2].innerHTML = comb[i];
        }
    } else {
        alert(trans[language]['invalid']);
    }
}

function translate(from, to) {
    var from_string = trans[from]['string'];
    var to_string = trans[to]['string'];
    const elements = document.getElementsByClassName('string');
    for (let element of elements) {
        element.innerHTML = to_string[from_string.indexOf(element.innerHTML)];
    }
    var rows = document.getElementById('table').rows;
    for (var i = 0; i < rows.length - 1; i++) {
        rows[i + 1].cells[1].innerHTML = trans[to]['menu_price'][i];
    }
    document.getElementById('submit').className = `string ${to}`;

    var input = document.getElementById('input');
    input.className = `${to}`;
    input.setAttribute('placeholder', to_string[from_string.indexOf(input.getAttribute('placeholder'))]);
}

window.onload = () => {
    if (language !== "English") {
        translate('English', language);
        document.getElementById('selecter').value = language;
    }

    var table = document.getElementById('table');
    for (let i = 0; i < l; i++) {
        let row = table.insertRow(-1);
        for (let j = 0; j < 3; j++) {
            let cell = row.insertCell(j);
            if (j == 0) {
                cell.innerHTML = menu_string[i];
            } else if (j == 1) {
                cell.innerHTML = trans[language]['menu_price'][i];
            } else {
                cell.innerHTML = 0;
            }
        }
    }
    document.getElementById('selecter').onchange = function() {
        var selectedLanguage = this.children[this.selectedIndex].innerHTML.trim();
        if (language !== selectedLanguage) {
            translate(language, selectedLanguage);
            language = selectedLanguage;
            input.value = memo_n;
            var [comb, cost, meari] = optimize(memo_n);
            [memo_meari, memo_cost] = [meari, cost];
            document.getElementById('result').innerHTML = trans[language]['result'](meari, memo_n, cost);
            var rows = document.getElementById('table').rows;
            for (var i = 0; i < rows.length - 1; i++) {
                rows[i + 1].cells[2].innerHTML = comb[i];
            }
        }
    }
}