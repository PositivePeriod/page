const natural = require('natural');

var originalText = "I fly. The flies try to eat the apple. A fly ate it.";
var data = check(originalText);
console.log("IMPROTANT | data");
data.tokens.forEach((value, index) => { console.log(index, value) });

function check(text) {
    var lines = text.split(/\.[ \n]/g);
    console.log("IMPROTANT | lines", lines);
    var analytics = {
        "character": text.length,
        "word": text.split(" ").length,
        "sentence": lines.length,
    }
    var tokens = new Map();
    lines.forEach((line, lineIndex) => {
        var words = natural.PorterStemmer.tokenizeAndStem(line); // tokenize하고 stopword 지우고 stem?
        console.log("IMPROTANT | words", lineIndex, words); // 원래 text에서 위치 찾기
        words.forEach((word, wordIndex) => {
            var pos = { "line": lineIndex, "word": wordIndex, "length": word.length };
            if (tokens.has(word)) {
                var token = tokens.get(word);
                token.push(pos);
                tokens.set(word, token);
            } else {
                tokens.set(word, [pos]);
            }
        });
    });
    analytics["tokens"] = tokens;
    return analytics
}

// var corpus = ['something', 'soothing', 'opinion'];
// var spellcheck = new natural.Spellcheck(corpus);
// console.log(spellcheck.getCorrections('soemthing', 1));

// const language = "EN"
// const defaultCategory = 'N';
// const defaultCategoryCapitalized = 'NNP';
// var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
// var ruleSet = new natural.RuleSet(language);
// var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
// var sentence = "I fly. The flies try to eat the apple. A fly ate it.";
// console.log(tagger.tag(sentence.split(' ')));