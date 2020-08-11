const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const unirest = require('unirest')
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views' )
app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({ extended: false, limit:'500kb' }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    var most_searched = unirest('GET','https://yts.mx/api/v2/list_movies.json?minimum_rating=7&sort_by=like_count&order_by=desc&limit=12')

    most_searched.end((result)=>{
        if (result.error) throw new Error(result.error)
        const most_searched = result.body.data.movies
        
        res.render('index', {
            most_searched: most_searched
        })
    })
})

app.get('/most-searched', (req, res) => {
    var list = unirest('GET','https://yts.mx/api/v2/list_movies.json?minimum_rating=5&sort_by=like_count&order_by=desc&limit=50')

    list.end((result)=>{
        if (result.error) throw new Error(result.error)
        const list = result.body.data.movies
        // console.log(list)
        res.render('most-searched', {
            list: list
        })
    })
})

app.get('/latest', (req, res) => {
    var latest = unirest('GET','https://yts.mx/api/v2/list_movies.json?sort_by=year&order_by=desc&limit=50')

    latest.end((result)=>{
        if (result.error) throw new Error(result.error)
        const latest = result.body.data.movies
        // console.log(list)
        res.render('latest', {
            latest: latest
        })
    })
})

app.get('/highest-rated', (req, res) => {
    var rating = unirest('GET','https://yts.mx/api/v2/list_movies.json?sort_by=rating&order_by=desc&limit=50')

    rating.end((result)=>{
        if (result.error) throw new Error(result.error)
        const rating = result.body.data.movies
        
        res.render('highest-rated', {
            rating: rating
        })
    })
})

app.get('/search', (req, res) => {
    const search = req.query.s
    // var searchapi = unirest("GET", "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/"+search+"");
    var searchapi = unirest("GET", "https://yts.mx/api/v2/list_movies.json?query_term="+search+"")

    searchapi.end(function (result) {
        if (result.error) throw new Error(result.error);
        const search = result.body.data.movies
        res.render('search', {
            search: search
        })
        // console.log(search);
        // res.send(search)
    });
})

app.get('/show', (req, res) => {
    const searchid = req.query.search
    var filmapi = unirest("GET", "https://yts.mx/api/v2/movie_details.json?movie_id="+searchid+"");

    filmapi.end(function (result) {
        if (result.error) throw new Error(result.error);

        const details = result.body.data.movie
        
        res.render('search-details', {
            details: details
        })
    });
})


app.listen(5000, ()=> {
    try {
        console.log('server is live at port 5000')
    } catch(e) {
        console.log(e)
    }
})