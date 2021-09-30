export class Stage {
    constructor() {
        this.stageList = ['square', 'factorial', 'prime', 'random']
        this.minStageID = 1;
        this.maxStageID = this.stageList.length;
        this.stageID = this.minStageID;
    }

    async content() {
        var filePath = `./data/${this.stageList[this.stageID - 1]}.json`;
        var response = await fetch(filePath)
        return response.json()
    }

    previous() {
        this.stageID = Math.max(--this.stageID, this.minStageID);
    }

    next() {
        this.stageID = Math.min(++this.stageID, this.maxStageID);
    }
}