import { Stage } from './stage.js'

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
        var content = await this.stage.content();
        var code = document.getElementById("code").value + ";return data";
        try {
            var result = new Function(code)();
            if (content.data === result) {
                var state = code.length < content.data.length ? 'Valid Efficient Code' : 'Valid Inefficient Code';
                document.getElementById("state").innerText = `Code State: ${state}`;
                document.getElementById("codeLen").innerText = `Code Length: ${code.length}`;
            } else {
                console.log("Invalide result:", result);
                document.getElementById("state").innerText = `Code State: Invalid Code returning incorrect value`;
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("state").innerText = `Code State: Invalid Code having runtime error`;
            document.getElementById("codeLen").innerText = `Code Length:`;
        }
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