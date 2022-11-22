
/* -- Application variables -- */

const CLOCK_ELEM = "#clock-container"       // clock container element id


/* -- Tools for application -- */

/** This class manage the digial clock on the webpage */
class ClockManager {

    #element

    /** 
     * @remarks Constructor use jQuery to get clock element by id.
     * 
     * @param {string} elemId - jQuery id selector
     */
    constructor(elemId) {
        this.#element = $(elemId)
    }

    /** method hold digital clock function */
    #digitalClock() {
        setInterval(() => {

            // get current date and time
            const date = new Date()

            // get date elements to construct a datestring as required in documentation
            const day = date.toLocaleDateString("en", {day: "2-digit"});
            const month = date.toLocaleDateString("en", {month: "long"});
            const year = date.toLocaleDateString("en", {year: "numeric"});
            const dateString = `${day}, ${month}, ${year}`;

            // get time only
            const timeString = date.toTimeString().split(" ")[0];

            // create and output datetime string to element
            const output = `${dateString}, ${timeString}`;
            this.#element.text(output);

        }, 1000)
    }

    /** runs digital clock on web page */
    run() {
        this.#digitalClock()
    }
}


/** This class  */
class Application {

    #clock  // field for clock object

    // default constructor
    constructor() {
        this.#clock = new ClockManager(CLOCK_ELEM)
    }

    /** Run method should run all functions in the application */
    run() {
        this.#clock.run()
    }
}

// create application instance
const app = new Application()

// run application
app.run()
