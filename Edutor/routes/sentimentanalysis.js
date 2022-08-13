// for sentiment analysis  -- review
const express = require('express');
const aposToLexForm = require('natural');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

const router = express.Router();

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

router.post('/s-analyzer', function (req, res, next) {
    const { review } = req.body;

    // data pre-process 
    const lexedReview = aposToLexForm(review);      // remove contractions
    console.log("lexed data: ", lexedReview);

    // set words to lower case
    const casedReview = lexedReview.toLowerCase();
    console.log("lowercase: ", casedReview);

    // remove non-alphabetical and special characters
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    console.log("only alpha: ", alphaOnlyReview);

    // tokenization
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    console.log("tokenized data: ", tokenizedReview);

    // correct misspelled words
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })

    // removing stop words ('a', 'or', 'what')
    const filteredReview = SW.removeStopwords(tokenizedReview);
    console.log("after removing stop words: ", filteredReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = new analyzer.getSentiment(filteredReview);
    console.log("sentiment score: ", analysis);

    res.status(200).json({ analysis });
});

module.exports = router;
