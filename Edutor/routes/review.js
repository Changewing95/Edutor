const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const fetch = require('isomorphic-fetch')
const { stringify } = require('querystring');
const fs = require('fs');
const upload = require('../helpers/reviewImageUpload');
// models
const Review = require('../models/Review');
const Consultation = require('../models/Booking')
const Event = require('../models/Event');
const Tutorial = require('../models/Tutorial');
const Complain = require('../models/Complain');
const moment = require('moment');

// const Order = require('../models/Order');
// const OrderItems = require('../models/OrderItems');

// for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');


// for validation
const ensureAuthenticated = require('../helpers/auth');
const { Console } = require('console');
const OrderItems = require('../models/OrderItems');

// sentiment analysis
const natural = require('natural');

const stopword = require('stopword');

// function to checkdate endtime > current:
function checkEndTimeCurrentTime(array, type) {
    // verify if endtime is later than current (so that user can leave feedback)
    var consult_endtime;
    var consult_date;

    switch (type) {
        case 'e':
            // verify if endtime is later than current (so that user can leave feedback)
            consult_endtime = ((array[0].endtime).toString()).slice(16, 24);
            consult_date = ((array[0].enddate).toString()).slice(4, 16);

            break;
        case 'c':
            // verify if endtime is later than current (so that user can leave feedback)
            consult_endtime = ((array[0].end_time).toString()).slice(16, 24);
            consult_date = ((array[0].date).toString()).slice(4, 16);
            break;
    }

    // concat both date and time together
    var consult_date_endtime = consult_date.concat(' ', consult_endtime);
    // create new date object
    var check = new Date(consult_date_endtime);

    // current datetime
    var today = moment();

    return (check > today);
}


// For conversion of contractions to standard lexicon 
const wordDict = {
    "aren't": "are not",
    "can't": "cannot",
    "couldn't": "could not",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he would",
    "he'll": "he will",
    "he's": "he is",
    "i'd": "I would",
    "i'd": "I had",
    "i'll": "I will",
    "i'm": "I am",
    "isn't": "is not",
    "it's": "it is",
    "it'll": "it will",
    "i've": "I have",
    "let's": "let us",
    "mightn't": "might not",
    "mustn't": "must not",
    "shan't": "shall not",
    "she'd": "she would",
    "she'll": "she will",
    "she's": "she is",
    "shouldn't": "should not",
    "that's": "that is",
    "there's": "there is",
    "they'd": "they would",
    "they'll": "they will",
    "they're": "they are",
    "they've": "they have",
    "we'd": "we would",
    "we're": "we are",
    "weren't": "were not",
    "we've": "we have",
    "what'll": "what will",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "where's": "where is",
    "who'd": "who would",
    "who'll": "who will",
    "who're": "who are",
    "who's": "who is",
    "who've": "who have",
    "won't": "will not",
    "wouldn't": "would not",
    "you'd": "you would",
    "you'll": "you will",
    "you're": "you are",
    "you've": "you have",
    "'re": " are",
    "wasn't": "was not",
    "we'll": " will",
    "didn't": "did not"
}

// Contractions to standard lexicons Conversion 
const convertToStandard = text => {
    const data = text.split(' ');
    data.forEach((word, index) => {
        Object.keys(wordDict).forEach(key => {
            if (key === word.toLowerCase()) {
                data[index] = wordDict[key]
            };
        });
    });
    return data.join(' ');
}

// LowerCase Conversion 
const convertTolowerCase = text => {
    return text.toLowerCase();
}

// Pure Alphabets extraction 
const removeNonAlpha = text => {
    // This specific Regex means that replace all non alphabets with empty string. 
    return text.replace(/[^a-zA-Z\s]+/g, '');
}

// getting the sentiment score
function sentimental_analysis(description) {
    // NLP Logic 
    // Convert all data to its standard form 
    const lexData = convertToStandard(description);
    console.log("Lexed Data: ", lexData);

    // Convert all data to lowercase 
    const lowerCaseData = convertTolowerCase(lexData);
    console.log("LowerCase Format: ", lowerCaseData);

    // Remove non alphabets and special characters 
    const onlyAlpha = removeNonAlpha(lowerCaseData);
    console.log("OnlyAlpha: ", onlyAlpha);

    // Tokenization 
    const tokenConstructor = new natural.WordTokenizer();
    const tokenizedData = tokenConstructor.tokenize(onlyAlpha);
    console.log("Tokenized Data: ", tokenizedData);

    // Remove Stopwords 
    const filteredData = stopword.removeStopwords(tokenizedData);
    console.log("After removing stopwords: ", filteredData);

    // Stemming 
    const Sentianalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const sentiment_score = Sentianalyzer.getSentiment(filteredData);
    // console.log("Sentiment Score: ", sentiment_score);

    return (sentiment_score.toFixed(2));
}


// REVIEW
// for students
router.get('/main', ensureAuthenticated, (req, res) => {
    Review.findAll({
        where: { userId: req.user.id },
        order: [['createdAt']],
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/review', { reviews });
        })
        .catch(err => console.log(err));
});

router.get('/:reviewid/:prodtype/:prodid/followup', ensureAuthenticated, (req, res) => {
    const prodType = req.params.prodtype;
    const reviewid = req.params.reviewid;

    switch (prodType) {
        case 'consultation session':
            Consultation.findByPk(req.params.prodid)
                .then((query) => {
                    console.log(query);
                    // pass object to review.hbs
                    res.render('review/query', { query, reviewid });
                })
                .catch(err => console.log(err));
            break;
        case 'event':
            Event.findByPk(req.params.prodid)
                .then((query) => {
                    // pass object to review.hbs
                    res.render('review/query', { query, reviewid });
                })
                .catch(err => console.log(err));
            break;
        case 'course':
            Tutorial.findByPk(req.params.prodid)
                .then((query) => {
                    // pass object to review.hbs
                    res.render('review/query', { query, reviewid });
                })
                .catch(err => console.log(err));
            break;
    }
});


router.get('/choose', ensureAuthenticated, async (req, res) => {
    // sql query
    let product = await db.query(`SELECT prod_name, name, prodType
                                    FROM orderitems
                                    INNER JOIN users
                                    ON users.id = orderitems.tutor_id
                                    WHERE orderitems.leftReview = false
                                    `, { type: QueryTypes.SELECT });
    // console.log(product)
    res.render('review/choose', { orders: product });
});

router.get('/:tutorid', ensureAuthenticated, (req, res) => {
    Review.findAll({
        where: { tutor_id: `${req.params.tutorid}` },
        order: [['createdAt']],
        raw: true
    })
        .then((reviews) => {
            // pass object to consultation.hbs
            res.render('review/tutorReviews', { reviews });
        })
        .catch(err => console.log(err));

})

router.get('/create/:prodType/:prodname', ensureAuthenticated, async (req, res) => {
    const productname = (req.params).prodname
    const prodType = req.params.prodType

    if (prodType === 'consultation session') {
        let product = await db.query(`SELECT id, title, date, end_time, userId
                                        FROM consultations
                                        WHERE title = '${productname}'
                                        `, { type: QueryTypes.SELECT });

        var checking = checkEndTimeCurrentTime(product, 'c');

        if (checking) {
            console.log('cannot leave review');
            flashMessage(res, 'error', "You can't leave review for " + productname + " yet! Wait until the designated end time of the " + prodType + " to end before doing so.");
            res.redirect('../../../review/choose');
        }
        else {
            console.log('can leave review');
            res.render('review/addReview', { product });
        }

    }
    else if (prodType === 'event') {
        Event.findAll({
            where: { title: productname },
            raw: true
        })
            .then((product) => {
                var checking = checkEndTimeCurrentTime(product, 'e')

                if (checking) {
                    console.log('cannot leave review');
                    flashMessage(res, 'error', "You can't leave review for " + productname + " yet! Wait until the designated end time of the " + prodType + " to end before doing so.");
                    res.redirect('../../../review/choose');
                }
                else {
                    console.log('can leave review');
                    res.render('review/addReview', { product });
                }
            })
            .catch(err => console.log(err));
    }
    else {
        let product = await db.query(`SELECT id, title, userId
                                        FROM tutorials
                                        WHERE title = '${productname}'
                                        `, { type: QueryTypes.SELECT });
        res.render('review/addReview', { product });
    }
});

router.get('/editReview/:id', ensureAuthenticated, (req, res) => {
    Review.findByPk(req.params.id)
        .then((review) => {
            if (!review) {
                flashMessage(res, 'error', 'Video not found');
                res.redirect('/student/review/main');
                return;
            }
            if (req.user.id != review.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/student/review/main');
                return;
            }

            res.render('review/editReview', { review });
        })
        .catch(err => console.log(err));
});

router.get('/displaycomplain/:id', ensureAuthenticated, (req, res) => {
    Complain.findAll({
        where: { reviewId: `${req.params.id}` },
        raw: true
    })
        .then((complains) => {
            // pass object to consultation.hbs
            res.render('review/viewcomplain', { complains });
        })
        .catch(err => console.log(err));

})




// ROUTES (POST)
// CREATE
router.post('/create/:prodType/:prodname', ensureAuthenticated, async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.params.prodType;
    let description = req.body.description;
    let userId = req.user.id;
    let tutor_id = req.body.tutorid;
    let product_id = req.body.prod_id;
    let product_name = req.body.prod_name;
    let username = req.user.name;

    // calculation of sentiment score:
    const sentiment_score = sentimental_analysis(description);

    // recaptcha -- advanced feature
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const query = stringify({
        secret: secretKey,
        response: resKey,
        remoteip: req.connection.remoteAddress
    })
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    // if not successful
    if (body.success !== undefined && !body.success) {
        flashMessage(res, 'error', 'Please click recaptcha!');
        res.redirect('/student/review/create');
    }
    // if successful
    if (body.success) {
        const message = 'Review successfully submitted';
        flashMessage(res, 'success', message);
        Review.create({ title, category, image, rating, description, tutor_id, product_id, product_name, sentiment_score, username, userId })
            .then((review) => {
                OrderItems.update(
                    { leftReview: true },
                    {
                        where: {
                            cust_id: `${req.user.id}`,
                            prod_name: `${req.params.prodname}`
                        }
                    })
                    .then((result) => {
                        console.log(result[0] + ' leftReview set to true');
                        console.log(review.toJSON());
                        if (sentiment_score > 0) {
                            res.redirect('/student/review/main');
                        }
                        else if (sentiment_score == 0) {
                            res.redirect(`/student/review/${review.id}/${category}/${product_id}/followup`);
                        }
                        else {
                            res.redirect(`/student/review/${review.id}/${category}/${product_id}/followup`);
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
});


// EDIT
router.post('/editReview/:id', ensureAuthenticated, async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.params.prodType;
    let description = req.body.description;
    let userId = req.user.id;
    let tutor_id = req.body.tutorid;
    let product_id = req.body.prod_id;

    // calculation of sentiment score:
    const sentiment_score = sentimental_analysis(description);

    // recaptcha -- advanced feature
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const query = stringify({
        secret: secretKey,
        response: resKey,
        remoteip: req.connection.remoteAddress
    })
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    // if not successful
    if (body.success !== undefined && !body.success) {
        flashMessage(res, 'error', 'Please click recaptcha!');
        res.redirect('/student/review/create');
    }
    // if successful
    if (body.success) {
        const message = 'Review slot successfully submitted';
        flashMessage(res, 'success', message);

        Review.update(
            { title, category, image, rating, description, tutor_id, product_id, sentiment_score, userId },
            { where: { id: req.params.id } }
        )
            .then((result) => {
                console.log(result[0] + ' review updated');
                res.redirect('/student/review/main');
            })
            .catch(err => console.log(err));
    }
});


// DELETE
router.get('/deleteReview/:id/:prodname', ensureAuthenticated, async function (req, res) {
    try {
        let review = await Review.findByPk(req.params.id);
        if (!review) {
            flashMessage(res, 'error', 'Review not found');
            res.redirect('/student/review/main');
            return;
        }
        if (req.user.id != review.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/student/review/main');
            return;
        }
        let result = await Review.destroy({ where: { id: review.id } });
        OrderItems.update(
            { leftReview: false },
            {
                where: {
                    cust_id: `${req.user.id}`,
                    prod_name: `${req.params.prodname}`
                }
            })
            .then((result) => {
                console.log(result[0] + ' leftReview set to false');
            })
            .catch(err => console.log(err));

        console.log(result + ' review deleted');
        flashMessage(res, 'info', 'Review deleted');
        res.redirect('/student/review/main');
    }
    catch (err) {
        console.log(err);
    }
});

// create for complain message (if sentiment_score <= 0)
router.post('/:reviewid/:prodtype/:prodid/followup', ensureAuthenticated, (req, res) => {
    const prodType = req.params.prodtype;
    const prodId = req.params.prodid;
    const complain = req.body.complain;
    const reviewId = req.params.reviewid;
    const userId = req.user.id;

    Complain.create({ prodType, prodId, complain, reviewId, userId })
        .then((complain) => {
            console.log(complain.toJSON());
            flashMessage(res, 'info', "Your valuable feedback has been received. Our tutors will look at it and prevent this from happening again");
            res.redirect('/student/review/main');
        })
        .catch(err => console.log(err));

});

// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/review/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/review/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            res.json({
                file: `/uploads/review/${req.user.id}/${req.file.filename}`
            });
        }
    });
});


module.exports = router;