const request = require('request');

const forecast = (latitude, longitude, call) => {
    const url = `http://api.weatherstack.com/current?access_key=05d09c157943a296903a0604af70a83e&query=${latitude},${longitude}&units=m`;
    request({url, json: true}, (error, {body}) => {
        if (error) {
            call('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            call('Unable to find location', undefined)
        } else {
            console.log(body.current);
            call(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out. The humidity ${body.current.humidity}%`)
        }
    })
};

module.exports = forecast;