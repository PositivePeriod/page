window.onload = () => {
    var exampleUrl1 = "https://dl.acm.org/doi/abs/10.1145/108844.108874";
    // const headers = new Headers({
    //     'Content-Type': 'text/xml',
    //     'Access-Control-Allow-Origin': '*'
    // });
    // fetch(exampleUrl1, { headers })
    //     .then(function(response) {
    //         console.log(response);
    //         return response.json();
    //     })
    //     .then(function(myJson) {
    //         console.log(JSON.stringify(myJson));
    //     });
    var req = new XMLHttpRequest();
    req.open('GET', exampleUrl1, true);
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            console.log(req.responseText);
        }
    }
}

// Public
// https://kiss.kstudy.com/
// http://www.riss.or.kr/
// https://dl.nanet.go.kr/
// https://www.kci.go.kr/

// Public English
// https://scholar.google.com/
// https://www.sciencedirect.com/
// https://academic.microsoft.com/
// https://onlinelibrary.wiley.com/
// https://www.researchgate.net/
// https://arxiv.org/

// Private
// https://www.dbpia.co.kr/