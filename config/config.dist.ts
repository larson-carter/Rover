import RoverConfig from "../src/struct/Config";

export default () : RoverConfig => ({

    server: {
        // The web port that Rover will communicate on.
        port: 3000
    },

    application: {
        // If a URL is invalid or useless (such as the index URL)
        // you can use this setting to automatically redirect the user to your homepage.
        defaultRedirect: "https://apollotv.xyz/"
    },

    database: {
        url: "mongodb://127.0.0.1:27017/rover"
    }

});