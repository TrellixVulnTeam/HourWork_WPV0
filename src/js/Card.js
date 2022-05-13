export class Card {
    constructor(frontText = " ", backText = " ", weight = 0.0) {
        this.frontText = frontText;
        this.backText = backText;
        this.weight = weight;
    }
    getFrontText() {
        return this.frontText;
    }
    setFrontText(str) {
        this.frontText = str;
    }
    getBackText() {
        return this.backText;
    }
    setBackText(str) {
        this.backText = str;
    }
    getWeight(){
        return this.weight;
    }
    setWeight(w){
        this.weight = w;
    }
    toString() {
        return this.frontText + ' ' + this.backText + ' ' + this.weight;
    }
    toJSON(){
        return {
            frontText: this.frontText,
            backText: this.backText,
            weight: this.weight
        }
    }

}