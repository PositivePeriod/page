let removeToast;
const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');

function toast(string, state) {
    const toast = document.getElementById("toast");
    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(() => { toast.classList.remove("reveal") }, 1000)) :
        removeToast = setTimeout(() => { toast.classList.remove("reveal") }, 1000)
    toast.innerText = string;
    var color = "rgb(50, 50, 50)"
    if (state == "success") {
        color = "rgb(60, 195, 163)";
    } else if (state == "failure") {
        color = "rgb(217, 85, 59)";
    }
    toast.style.background = color;
    toast.classList.add("reveal");
}

function beautify(content) {
    // 1. Get content
    content = content.replace(/\u0002/g, '');
    content = content.replace(/\s/g, ' ');
    /*
    content = content.replace(/\t/g, ' ');
    content = content.replace(/\r/g, ' ');
    content = content.replace(/\n/g, '  ');*/

    // 2. Sentence classify
    content = content.replace(/\. +/g, '\.\n'); // default
    content = content.replace(/:(?=[^ ])/g, ': \n'); // additional content or equation
    content = content.replace(/;(?=[^ ])/g, '; '); // additional content or equation
    content = content.replace(/; +/g, ';\n'); // additional content or equation

    // var integerRegex = '/^[0-9]+$/'
    content = content.replace(/\(([0-9]+)\.([0-9]+)\)/g, (match) => (match + '\n')); // equation; Ex) (2.16)

    // except some cases like Fig.1.1. about dot
    //  Ex) Fig.1.2, Mr.Steven, pp. 58 - 70
    const daily_single_abbr = ['Fig', 'ft', 'lb', 'lbs', 'Mr', 'Mrs', 'Ms', 'Jr', 'Eq', 'Eqs', 'pp', 'Vol', 'Pt', 'Dr', 'Dept', 'par', 'Mt', 'et al', 'Bros', 'Oxf'];
    const case_insensitive_abbr = ['Tel', 'Govt', 'Inc', 'No'];
    const time_unit_abbr = ['sec', 'min', 'hr', 'wk', 'mo', 'yr'];
    const day_abbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const month_abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'Aug', 'Sep', 'Sept', 'Oct', 'Nov', 'Dec'];
    const single_period_abbr = [...daily_single_abbr, ...case_insensitive_abbr, ...case_insensitive_abbr.map(x => x.toLowerCase()), ...time_unit_abbr, ...day_abbr, ...month_abbr];
    single_period_abbr.forEach(word => {
        var regex = new RegExp(word + '\\.[ \\n]*', 'g');
        content = content.replace(regex, `${word}. `);
    });

    const daily_multiple_abbr = ['a.m.', 'A.M.', 'p.m.', 'P.M.', 'A.D.', 'B.C.', 'B.C.E.', 'C.E.', 'Q.E.D.', 'Ph.D.', 'P.E.', 'p.p.', 'P.P.'];
    const location_abbr = ['i.e.', 'U.N.', 'U.S.A.', 'U.S.', 'L.A.', 'U.K.', 'N.Z.'];
    const multiple_period_abbr = [...daily_multiple_abbr, ...location_abbr];
    multiple_period_abbr.forEach(word => {
        var regex = new RegExp(word + '[ \\n]*', 'g');
        content = content.replace(regex, `${word} `);
    });

    // Ex) Fig.1.2, Mr.Steven, pp. 58 - 70
    content = content.replace(/(\.[0-9]+\.)\n/g, (match, p1) => (p1));

    // 3. little grammar error - except some cases like 1. or Mr.about dot
    // int
    // Ex) 1. one content, 2. another content
    content = content.replace(/(\n[0-9]+\.)\n/g, (match, p1) => (p1));
    content = content.replace(/( [0-9]+\.)\n/g, (match, p1) => (p1));

    // TODO - is it right in the logic
    // alphabet A ~ Z, a ~ z
    // Ex) A. one content, B. another content, a. one content, b. another content
    /*content = content.replace(/(\n[a-zA-Z]+\.)\n/g, (match, p1) => (p1))
    content = content.replace(/( [a-zA-Z]+\.)\n/g, (match, p1) => (p1))
    contradict? - ascii A ~ Z; Ex) A. G. M. Michell
    content = content.replace(chr(i) + ". \n", chr(i) + ". ")*/

    /* To specific// ascii a ~ z
    content = content.replace("-" + chr(i) + ".\n", "-" + chr(i) + ". ")
    // Ex) Fig.4.1a-c.*/

    // 4. Clean 
    content = content.replace(/ +/g, ' '); // '     ' -> ' '
    content = content.replace(/( ?)+\n+( ?)+/g, '\n'); // '    \n\n\n ' -> '\n'
    content = content.replace(/ +\./g, '.'); // '     .' -> '.'
    content = content.replace(/ +,/g, ','); // '     ,' -> ','
    content = content.replace(/,(?=[^ ])/g, ', '); // ',else' -> ', else'

    // 5. Finish
    return content
}

function adjustHeights(event) {
    inputElement.style.height = "1px";
    inputElement.style.height = input.scrollHeight + "px";

    outputElement.style.height = "1px";
    outputElement.style.height = output.scrollHeight + "px";
}

function check() {
    var content = inputElement.value;
    outputElement.value = beautify(content);
    // output.select();
    adjustHeights();
    //window.scroll({top: 0, left: 0, behavior: 'smooth'});
    toast('Beautify Success', 'success');
}

function clear() {
    inputElement.value = "";
    outputElement.value = "";
}

function search(trans) {
    var text = outputElement.value;
    var userLang = (navigator.language || navigator.userLanguage).substr(0, 2);
    if (trans == 'google') {
        text = encodeURIComponent(text);
        text = text.replace(/%22/g, '"');
        text = text.replace(/%3C/g, '<');
        text = text.replace(/%3E/g, '>');
        text = text.replace(/'/g, '%27');
        var googleUrl = `http://translate.google.com/?sl=auto&tl=${userLang}&text=${text}`;
        window.open(googleUrl);
        console.log(googleUrl);
    } else if (trans == 'papago') {
        text = encodeURIComponent(text);
        text = text.replace(/%26/g, '%25amp'); // *
        text = text.replace(/%22/g, '%25quot'); // "
        text = text.replace(/'/g, '%25%2339');
        text = text.replace(/%3C/g, '%25lt'); // <
        text = text.replace(/%3E/g, '%25gt'); // >
        text = text.replace(/%2F/g, '%25%23x2F'); // /
        var papagoUrl = `https://papago.naver.com/?sk=auto&tk=${userLang}&st=${text}`;
        window.open(papagoUrl);
        console.log(papagoUrl);
    };
}

window.onload = () => {
    // Textarea changing height
    inputElement.setAttribute('placeholder', 'Paste (Ctrl+V) your text.\nPress Shift+Enter for new line.');
    outputElement.setAttribute('placeholder', 'Press the button or Enter.\nCopy (Ctrl+C) your text.');

    inputElement.addEventListener('input', adjustHeights);
    window.addEventListener("resize", adjustHeights, false);

    // Check with enter
    document.addEventListener("keydown", function onEvent(event) {
        if (event.key == 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                check();
            };
        };
    });

    // Check with button
    document.getElementById('clear').onclick = clear;
    // console.log(document.getElementById('clear').onclick);


    var clipIn = new ClipboardJS(document.getElementById('copy-input'));
    clipIn.on('success', function(e) {
        document.getSelection().removeAllRanges();
        toast('Copy Before Success', 'success');
    });
    clipIn.on('error', function(e) {
        toast('Copy Before Failure', 'failure');
    });

    var clipOut = new ClipboardJS(document.getElementById('copy-output'));
    clipOut.on('success', function(e) {
        document.getSelection().removeAllRanges();
        toast('Copy After Success', 'success');
    });
    clipOut.on('error', function(e) {
        toast('Copy After Failure', 'failure');
    });
}