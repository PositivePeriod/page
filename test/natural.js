const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
console.log(tokenizer.tokenize('Machine learning is awesome!'));
// ["Machine", "learning", "is", "awesome"]

const sentence = 'A process for removing the commoner morphological and inflexional endings from words in English.';
console.log(natural.PorterStemmer.tokenizeAndStem(sentence));
// ["process", "remov", "common", "morpholog", "inflexion", "end", "word", "english"]

// create a BayesClassifier
const dayAndNightClassifier = new natural.BayesClassifier();
// supply a training set of data for two membership: night and day
dayAndNightClassifier.addDocument('Moon is in the sky', 'night');
dayAndNightClassifier.addDocument('I see stars', 'night');
dayAndNightClassifier.addDocument('It is dark', 'night');
dayAndNightClassifier.addDocument('Sun is in the sky', 'day');
dayAndNightClassifier.addDocument('It is bright', 'day');
// training
dayAndNightClassifier.train();
console.log(dayAndNightClassifier.classify("I see a bright Sun"));
console.log(dayAndNightClassifier.classify("There is no sun in the sky"));
// new input is classified as day