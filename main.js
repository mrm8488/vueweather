const app = new Vue({
    el: '#app',
    data: {
        loading: true,
        lat: null,
        lon: null,
        location: null,
        temp: null,
        temp_low: null,
        temp_high: null,
        iconUrl: null

    },
    created() {

        navigator.geolocation.getCurrentPosition(pos => {
            console.log('got coordinates', pos.coords);
            this.lat = pos.coords.latitude;
            this.lon = pos.coords.longitude;
            this.loadWeather();
        });

    },
    methods: {
        loadWeather() {

            axios.get(makeAPIuri(this.lat, this.lon))
                .then(res => {
                    let weather = res.data.query.results.channel;
                    console.log('response', weather);

                    this.location = `${weather.location.city}, ${weather.location.region}`;
                    this.temp = fToC(weather.item.condition.temp);
                    this.temp_low = fToC(weather.item.forecast[0].low);
                    this.temp_high = fToC(weather.item.forecast[0].high);
                    this.desc = weather.item.condition.text;
                    const regex = new RegExp(/<img[^>]+src="?([^"\s]+)"?\s*\/>/g);
                    this.iconUrl = regex.exec(weather.item.description)[1];

                    console.log(this.iconUrl);

                    this.loading = false;

                })
                .catch(e => {
                    console.error(e);
                });

        }
    }

});

function makeAPIuri(lat, lon) {
    return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(${lat}%2C${lon})%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function fToC(fahrenheit) {
    var fTemp = fahrenheit;
    var fToCel = (fTemp - 32) * 5 / 9;
    return Math.round(fToCel.toFixed(2));
} 