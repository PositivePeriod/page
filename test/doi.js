const fetch = require('node-fetch');

function getDOIinTag(html) {
    var doiStart = html.indexOf('>https://doi.org');
    if (doiStart !== -1) {
        doiStart += 17;
        var doiEnd = html.indexOf('<', doiStart);
        return html.slice(doiStart, doiEnd)
    } else { return null }
}

function getDOIinHref(html) {
    var doiStart = html.indexOf('href="https://doi.org');
    if (doiStart !== -1) {
        doiStart += 22;
        var doiEnd = html.indexOf('"', doiStart);
        return html.slice(doiStart, doiEnd)
    } else { return null }
}

function getDOIinString(html) {
    var doiStart = html.indexOf('"https://doi.org');
    if (doiStart !== -1) {
        doiStart += 17;
        var doiEnd = html.indexOf('"', doiStart);
        return html.slice(doiStart, doiEnd)
    } else { return null }
}

function getDOIinHTML(html) {
    var method = [getDOIinTag, getDOIinHref, getDOIinString];
    var index = 0;
    var doi = null;
    while (doi === null && method[index] !== undefined) {
        var doi = method[index](html);
        index += 1;
    }
    return doi
}


var urls = [
    'https://www.sciencedirect.com/science/article/abs/pii/S0168874X02002251',
    'https://link.springer.com/chapter/10.1007/0-306-47461-1_15',
    'https://journals.lww.com/aidsonline/Fulltext/2003/17003/Virologic_and_immunologic_outcomes_and.2.aspx',
    'https://ieeexplore.ieee.org/abstract/document/8509315/',
    'https://onlinelibrary.wiley.com/doi/full/10.1002/art.10187', // cannot crawl
    'https://journals.lww.com/md-journal/fulltext/2003/09000/Morbidity_and_Mortality_in_Systemic_Lupus.2.aspx',
    'https://iopscience.iop.org/article/10.1088/0004-6256/142/3/72/meta',
];

var dois = [
    '10.1016/S0168-874X(02)00225-1',
    '10.1007/0-306-47461-1_15',
    null,
    '10.1109/ICDE.2018.00094',
    '10.1002/art.10187',
    '10.1097/01.md.0000091181.93122.55',
    '10.1088/0004-6256/142/3/72',
]

function getHtml(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => console.log(html));
}

urls.forEach((url, index) => {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            var doi = getDOIinHTML(html);
            if (doi !== dois[index]) {
                console.log(index, 'Fail', doi, dois[index]);
            }
            // else {
            //     console.log(index, 'Success', doi);
            // }
        });
});