export function executeCode(code, timeout = 5000) {
    var response = `self.onmessage = function (e) {
    try {
        new (function () {
            const globals = ['window', 'globalThis'];
            for (let prop in globalThis) { globals.push(prop); }
            return function (args = [], code = "") {
                const strictScope = {};
                for (const prop of globals) { if (!args.includes(prop)) { strictScope[prop] = undefined; } }
                const func = new Function('{' + Object.keys(strictScope).join(',') + '}', ...args, code);
                return func.bind(null, strictScope);
            }
        })()([], e.data)();
        if (typeof data === "undefined") { postMessage({ "data": undefined, "msg": "nodata" }); }
        else { postMessage({ "data": data, "msg": "success" }); }
    } catch (e) {
        postMessage({ "data": e, "msg": "failure" }); 
    }
}`;
    var blob;
    try {
        blob = new Blob([response], { type: 'application/javascript' });
    } catch (e) { // Backwards-compatibility
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        blob = new BlobBuilder();
        blob.append(response);
        blob = blob.getBlob();
    }
    window.URL = window.URL || window.webkitURL;
    var objectURL = URL.createObjectURL(blob);
    var worker = new Worker(objectURL);
    var dataResolve, dataReject;
    var data = new Promise(function (resolve, reject) {
        dataResolve = resolve;
        dataReject = reject;
        setTimeout(() => { resolve({ "data": undefined, "msg": "timeout" }); }, timeout);
    });
    worker.onmessage = function (e) {
        dataResolve(e.data);
        worker.terminate();
    }
    worker.postMessage(code);
    return data
}