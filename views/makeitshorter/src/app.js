import { Stage } from './stage.js'
import { executeCode } from './code.js';

export class App {
    constructor() {
        this.stage = new Stage();

        // this.pixelRatio = 1 // window.devicePixelRatio > 1 ? 2 : 1;
        // window.addEventListener("resize", this.resize.bind(this));
        // this.resize();

        var checkButton = document.getElementById('check');
        var previousButton = document.getElementById('previous');
        var nextButton = document.getElementById('next');
        var sampleCodeButton = document.getElementById('sampleCode');
        checkButton.onclick = this.checkCode.bind(this);
        previousButton.onclick = this.previousStage.bind(this);
        nextButton.onclick = this.nextStage.bind(this);
        sampleCodeButton.onclick = this.getSampleCode.bind(this);
        this.updateStage();
    }

    // resize() {
    //     var stageWidth = document.body.clientWidth * this.pixelRatio;
    //     var stageHeight = document.body.clientHeight * this.pixelRatio;
    //     this.output.style.width = stageWidth;
    // }

    async updateStage() {
        var content = await this.stage.content();
        document.getElementById("stage").innerText = `function stage${this.stage.stageID}() {`
        document.getElementById("dataElem").innerText = `Data: ${content.data}`;
        document.getElementById("dataLen").innerText = `Data Length: ${content.data.length}`;
        document.getElementById("code").value = '';
        document.getElementById("state").innerText = `Code State:`;
        document.getElementById("codeLen").innerText = `Code Length:`;
    }

    async checkCode() {
        document.getElementById("state").innerText = `Code State:`;
        document.getElementById("codeLen").innerText = `Code Length:`;
        var timeout = 5000
        var content = await this.stage.content();
        var code = document.getElementById("code").value;
        var { msg, data } = await executeCode(code, timeout);
        switch (msg) {
            case "success":
                if (content.data === data) {
                    var state = code.length < content.data.length ? 'Valid efficient code' : 'Valid inefficient code';
                } else {
                    console.log("Invalid result:", data);
                    var state = 'Invalid code returning incorrect value';
                }
                break;
            case "nodata":
                var state = 'Invalid code without return data';
                break;
            case "failure":
                console.log("Error from code: ", data);
                var state = 'Invalid code having runtime error';
                break;
            case "timeout":
                var state = `Invalid code consuming more than ${timeout}ms`;
                break;
            default:
                var state = `Unexpected error; please share your code with me`
                break;
        }
        document.getElementById("state").innerText = `Code State: ${state}`;
        document.getElementById("codeLen").innerText = `Code Length: ${code.length}`;
    }

    async previousStage() {
        this.stage.previous();
        await this.updateStage();
    }

    async nextStage() {
        this.stage.next();
        await this.updateStage();
    }

    async getSampleCode() {
        var content = await this.stage.content();
        document.getElementById("code").value = content.sampleCode;
    }
}

window.onload = () => { new App() };