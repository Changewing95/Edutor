const procyon = require('procyon')
const express = require('express');
const router = express.Router();
const UserController = require('../Controller/User');



router.get('/lol', UserController.Recommendation);




async function main() {
    var procyon1 = new procyon({
        className: 'actxxress'
    })

    var procyon2 = new procyon({
        className: 'movixxez'
    })

    /* Actors */
    await procyon1.liked('gary', 'Jim Carrey')
    await procyon1.liked('gary', 'Keanu Reeves')
    await procyon1.liked('gary', 'Asa Akira')
    await procyon1.liked('gary', 'Riley Reid')
    await procyon1.disliked('gary', 'Sylvester Stallone')

    await procyon1.liked('pete', 'Asa Akira')
    await procyon1.liked('pete', 'Jim Carrey')
    await procyon1.disliked('pete', 'Hillary Duff')

    /* Movies */
    await procyon2.liked('gary', 'The Matrix')
    await procyon2.liked('gary', 'John Wick')
    await procyon2.disliked('gary', 'Titanic')

    await procyon2.liked('pete', 'John Wick')
    await procyon2.liked('pete', 'Hunger Games')
    await procyon2.liked('pete', 'Wall-E')
    await procyon2.disliked('pete', 'Titanic')

    let recommendations_actors = await procyon1.recommendFor('pete', 10)
    let recommendations_movies = await procyon2.recommendFor('gary', 10)

    console.log({ recommendations_actors, recommendations_movies })
}




module.exports = router;