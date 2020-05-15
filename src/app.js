const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Alex Ludanik'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alex Ludanik'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'For help press F1',
        title: 'Help',
        name: 'Alex Ludanik'
    })
});

app.get('', (req, res) => {
    res.send('<h1>Weather</h1>');
});

app.get('/weather', (request, response) => {
    if(!request.query.address){
        return response.send({
            error: 'You must provide an address!'
        })
    }

    geocode(request.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return response.send({error: error});
        }
        forecast(latitude,longitude, (error, forecastData)=>{
            if(error){
                return response.send({error: error});
            }
            response.send({
                forecast: forecastData,
                location: location,
                address: request.query.address
            })
        })
    })
});

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alex Ludanik',
        errorMessage: 'Help article not found.'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alex Ludanik',
        errorMessage: 'Page not found.'
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});