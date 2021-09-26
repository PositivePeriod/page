export class Stage {
    constructor() {
        this.stageID = 1;
        this.maxStageID = 3;
    }

    async content() {
    var filePath = `./data/${this.stageID}.json`;
    var response = await fetch(filePath)
    return response.json()
    }

    previous() {
        this.stageID = Math.max(--this.stageID, 1);
    }

    next() {
        this.stageID = Math.min(++this.stageID, this.maxStageID);
    }
}