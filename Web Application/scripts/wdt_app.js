/*
 *                                  --== WDT Appication ==--
 * 
 *  Created after specification as provided in the semester project assignment document.
 * 
 *  Since application is to follow the OOP paradigm, the program is run from a main application class.
 *  It is required to create an instance of the class and call the run function.
 * 
 * 
 *  REMARKS:    All functions mentioned under section of the grading criteria is created as standalone functions.
 *              This decition was made after consulting with a teacher indicated this was expected.
 *              I would have preferd to have written these as methods inside the application class or a nested class within
 *              the application class to encapsulate data and methods as such only run method is globally accessable.
 *              To remedy this, I have created all functions in light of easy transition to class methods.
 */


/*  == APPLICATION VARIABLES == */

/** Object for holding application configuration values
 * 
 * @remarks fields in all caps due to old habbit concering constant variables...
 */
const config = {
    API_URL: "https://randomuser.me/api/?results=5&nat=gb,us,no&inc=name,email,picture",
}

/** 
 * Object for holding jQuery selector strings.
 * 
 * @remarks fields in all caps due to old habbit concering constant variables...
 * */
const jqSelectors = {
    CLOCK_ELEM: "#clock-container",
    STAFF_TABLE: "#dashboard-staff-table tbody",
    STAFF_IN_BTN: "#staff-in-button",   
    STAFF_OUT_BTN: "#staff-out-button",
    STAFF_ROW: ".dashboard-staff-table-row",

    TOAST_CONTAINER: "#toast-container",

    DELIVERY_FORM: "#delivery-form",
    DELIVERY_ADD: "#delivery-add",
    DELIVERY_BOARD: "#dashboard-delivery-board tbody",
    DELIVERY_CLEAR_BUTTON: "#delivery-clear-btn",

    INPUT_VEHICLE: "#delivery-input-vehicle",
    INPUT_NAME: "#delivery-input-name",
    INPUT_SURNAME: "#delivery-input-surname",
    INPUT_TELEPHONE: "#delivery-input-telephone",
    INPUT_ADDRESS: "#delivery-input-address",
    INPUT_RETURN_TIME: "#delivery-input-return-time",
}


/*  == GRADING CRITERIA CLASSES ==  */

/** Employee class 
 * 
 * Created after customer specification.
 * Base class for other employee classes.
*/
class Employee {

    /**
     * 
     * @param {string} name Employee name
     * @param {string} surname Employee surname
     */
    constructor(name, surname) {
        this.name       = name;
        this.surname    = surname;
    }
}

/**
 * Staff Member Class
 * 
 * Created after customer specification
 */
class StaffMember extends Employee {

    // fields not required for constuctor
    outTime             = undefined;
    duration            = undefined;
    expectedReturnTime  = undefined;

    /**
     * @param {string} name Staff member name
     * @param {string} surname Staff member surname
     * @param {string} email Staff member email
     * @param {string} picture Url for staff member thumbnail picture
     */
    constructor(name, surname, email, picture) {

        super(name, surname)

        this.email      = email;
        this.picture    = picture;
        this.status     = "In";
    }

    /**
     * Handle staff member is late functionality
     */
    staffMemberIsLate() {
        staffMemberIsLate(this)
    }
}

/** 
 * Delivery Driver Class 
 * 
 * Created after customer specification.
 * */
class DeliveryDriver extends Employee {
    /**
     * @param {string} name Delivery driver name
     * @param {string} surname Delivery driver surname
     * @param {string} vehichle Vehicle string for svg in resource
     * @param {string} telephone Delivery driver phone number
     * @param {string} address Delivery address
     * @param {string} return_time Expected return time as string
     * @param {Application} appObj main class needed for delivery late functionality
     */
    constructor(name, surname, vehichle, telephone, address, return_time, appObj) {
        super(name, surname);
        this.vehichle = vehichle;
        this.telephone = telephone;
        this.address = address;
        this.returnTime = return_time;
        
        this.deliveryIsLate(appObj)
    }

    deliveryIsLate(appObj) {
        deliveryIsLate(this, appObj)
    }
}

/** == OTHER APPLICATION CLASSES == */

/**
 * Input field class
 * 
 * Used for handling field inputs and data validation
 */
class InputField {
    
    /**
     * @param {string} jqSelector string for jQuery selector
     */
    constructor(jqSelector) {
        this.field = $(jqSelector);                     // get element field
        this.errorField = $(`${jqSelector}-error`);     // get corresponding error field
        this.value = this.field.val();                  // get field value
    }

    /**
     * @param {() => string} callback validation rule as callback function, require string return for message.
     * @returns true if valid value, else false
     */
    validate(callback) {
        const message = callback(this.value);   // test value and recive message if any
        const isValid = message === "";         // check if message string is empty
        if (!isValid) this.setError(message)    // set error if return string not empty
        return isValid                          // return boolean for valid
    }

    /**
     * Handle error on validation
     * 
     * @param {string} message error message for error field
     */
    setError(message) {
        this.field.addClass("field-error")
        this.errorField.text(message)
    }
    /** Removes error and error message*/
    removeError() {
        this.field.removeClass("field-error")
        this.errorField.text("")
    }

    /** Reset field for new input */
    reset() { this.field.val("") }
}

/**
 * Application class
 * 
 * Main object for application. Run application by initializing and calling run method.
 */
class Application {

    #staffMembers        = [];
    #selectedStaffMember = undefined;
    #deliveries          = []
    #selectedDelivery    = undefined;

    constructor() { };

    /** run method starts application and add features to web page */
    run() {

        staffUserGet(this);  // load staff users from api
        digitalClock();      // starts digital clock

        $(jqSelectors.STAFF_OUT_BTN).click(() => staffOut(this));
        $(jqSelectors.STAFF_IN_BTN).click(() => staffIn(this));
        $(jqSelectors.DELIVERY_FORM).submit(() => addDelivery(this));
        $((jqSelectors.DELIVERY_CLEAR_BUTTON)).click(() => clearDelivery(this));

    }

    // getters and setters for staff members
    get staffMembers() { return this.#staffMembers };
    set staffMembers(staffmembers) { this.#staffMembers = staffmembers };
    
    // getters and setters for selected staff member
    get staffMemberSelected() { return this.#selectedStaffMember }
    set staffMemberSelected(staffmember) { this.#selectedStaffMember = staffmember }

    // getters and setters for deliveries
    get deliveries() { return this.#deliveries };
    set deliveries(deliveries) { this.#deliveries = deliveries };

    // getter and setter for selected delivery
    get deliverySelected() { return this.#selectedDelivery }
    set deliverySelected(delivery) { this.#selectedDelivery = delivery } 

    /**Appends delivery object to data array
     * @param {DeliveryDriver} item object to be added to deliveries array
     */    
    addDelivery(item) { this.#deliveries.push(item) };
    /** Removes delivery object from data array
     * @param {*} item 
     */
    removeDeliveries(item) { this.#deliveries = [...this.#deliveries].filter(x => x !== item) };
}


//  == FUNCTIONS FOR HANDLING TABLE AND ROWS ==
//  - separated from other functions for reusability

/**
 * Produce table rows as strings for jQuery appending to table.
 * Require data added to application object.
 * 
 * @param {Application} appObj application object
 * @returns string array representing table rows
 */
function createStaffTableRow(appObj) {
    let id = 1
    const result = appObj.staffMembers.map(s => {    
        const elem = 
            `<tr class="dashboard-staff-table-row" id="staffmember-${id++}">`+
                `<td><img src=${s.picture} alt="thumbnail"></td>`+
                `<td> ${s.name} </td>` +
                `<td> ${s.surname} </td>` +
                `<td> ${s.email} </td>` +
                `<td> ${s.status} </td>` +
                `<td> ${s.outTime ? s.outTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit"}) : "" }</td>` +
                `<td> ${s.duration ? s.duration : ""} </td>` +
            `<td> ${s.expectedReturnTime ? s.expectedReturnTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit"}) : ""} </td>` +
            "</tr>";
        return elem;
    })
    return result
}

/** 
 * Populate staff table with provided rows.
 * Add click feature to each row.
 * 
 * @param {string[]} rows string representing table rows to be insert in table
 * @param {Application} appObj application object
 */
function populateStaffTable(rows, appObj) {

    // clear table and repopulate
    const table = $(jqSelectors.STAFF_TABLE)
    table.empty()
    rows.map(x => {
        table.append(x)
    })

    // get children and add click event
    // REMARK:  I considered to extract this into a separate function,
    //          but left it as is due to local variables.
    const r = table.children();
    r.map(i => {

        const selector = r[i].id
        const elem = $(`#${selector}`);

        elem.removeClass("row-selected").click(() => {

            const email = r[i].children[3].innerText
            const self = appObj.staffMembers.find(x => x.email === email)
            const selected = appObj.staffMemberSelected;

            if (selected) {
                if (selected.email === email) {
                    appObj.staffMemberSelected = undefined;
                    elem.removeClass("row-selected")
                } else {
                    r.map(x => {
                        const e = `#${r[x].id}`;
                        $(e).removeClass("row-selected")
                    })
                    elem.addClass("row-selected")
                    appObj.staffMemberSelected = self;
                }
            }
            else {
                elem.addClass("row-selected")
                appObj.staffMemberSelected = self;
            }
        })
    })
}

/**
 * Produce table rows as strings for jQuery appending to table.
 * Require data added to application object.
 * 
 * @param {Application} appObj application object
 * @returns string array representing table rows
 */
function createDeliveryDriverTableRow(appObj) {
    let id = 1;
    const result = appObj.deliveries.map(d => {
        const svg = d.vehichle === "car" ? "./resources/car-front-fill.svg"  : "./resources/bicycle.svg"
        const elem = 
            `<tr class="dashboard-delivery-table-row" id="delivery-driver-${id++}">` +
                `<td><img src="${svg}" height="25"></td>` +
                `<td>${d.name}</td>` +
                `<td>${d.surname}</td>` +
                `<td>${d.telephone}</td>` +
                `<td>${d.address}</td>` +
                `<td>${d.returnTime}</td>` +
            "</tr>"
        return elem;
    })
    return result;
}

/** 
 * Populate delivery table with provided rows.
 * Add click feature to each row.
 * 
 * @param {string[]} rows string representing table rows to be insert in table
 * @param {Application} appObj application object
 */
function populateDeliveryDriverBoard(rows, appObj) {
    const table = $(jqSelectors.DELIVERY_BOARD);
    table.empty();
    rows.map(r => table.append(r))

    const r = table.children()
    r.map(i => {

        const selector = r[i].id;
        const elem = $(`#${selector}`);

        elem.removeClass("row-selected").click(() => {
            const phone = r[i].children[3].innerText;
            const self = appObj.deliveries.find(x => x.telephone === phone)
            const selected = appObj.deliverySelected;


            if (selected) {
                if (selected.telephone === phone) {
                    appObj.deliverySelected = undefined;
                    elem.removeClass("row-selected")
                } else {
                    r.map(x => {
                        const e = `#${r[x].id}`;
                        $(e).removeClass("row-selected")
                    })
                    elem.addClass("row-selected")
                    appObj.deliverySelected = self;
                }
            } else {
                elem.addClass("row-selected")
                appObj.deliverySelected = self;
            }
        })
    })
}


/**  == FUNCTIONS REQUIRED BY GRADING CRITERIA == */

/**
 *  Download user data from api and populate staff table.
 * 
 * @param {Application} appObj 
 */
function staffUserGet(appObj) {

    const request = new XMLHttpRequest();
    request.addEventListener("load", () => {

        // get staffmember data from randomuser api
        const response = request.responseText;
        // parse to json
        const json = JSON.parse(response);
        // extract users from response
        const usersRaw = json.results;

        // create users
        const staffMembers = usersRaw.map(x => {
            return new StaffMember(
                x.name.first,
                x.name.last,
                x.email,
                x.picture.thumbnail,
            );
        });

        appObj.staffMembers = staffMembers;

        // create table rows for each staff member
        const rows = createStaffTableRow(appObj);

        // insert data to table
        populateStaffTable(rows, appObj)
        
    }) 

    request.open("GET", config.API_URL, true);
    request.send();
}

/** Handles staff out click event
 * 
 * @param {Application} appObj 
 */
function staffOut(appObj) {

    const selected = appObj.staffMemberSelected;
    const allStaff = appObj.staffMembers;

    if (!selected) return;                  // return if no staff member selected
    if (selected.status === "Out") return   // return if staff member already out

    // promt user for time in minutes
    let time = undefined;
    while (true) {
        let userInput = prompt("Set staff out time in minutes");
        if (userInput === null) break;
        time = parseInt(userInput);
        if (!isNaN(time)) break;
    }

    if (time <= 0 || isNaN(time) || !time) return;

    // get time for now and expected returr
    const now = new Date();
    const back = new Date();
    back.setMinutes(now.getMinutes() + time);

    // get hours and minutes for out duration
    const hours = Math.floor(time / 60);
    const minutes = time - (hours * 60);
    const hourString = hours > 0 ? `${hours} hour, ` : "";
    const duration = `${hourString}${minutes} minutes`;

    // update object
    selected.status = "Out";
    selected.outTime = now;
    selected.expectedReturnTime = back;
    selected.duration = duration;
    
    // activate staff member is late
    selected.staffMemberIsLate();

    // repopulate table
    const staffElements = createStaffTableRow(appObj);
    populateStaffTable(staffElements, appObj);

    // remove selected staff member from app object
    appObj.staffMemberSelected = undefined;
}

/** Handle staff in click event
 * 
 * @param {Application} appObj 
 */
function staffIn(appObj) {
    const selected = appObj.staffMemberSelected;

    if (!selected) return;                  // return if no staff member is selected
    if (selected.status === "In") return;   // return if staff member is in

    // update staff member object
    selected.status = "In";
    selected.outTime = undefined;
    selected.duration = undefined;
    selected.expectedReturnTime = undefined;

    // repopulate staff member table
    const staffElements = createStaffTableRow(appObj);
    populateStaffTable(staffElements, appObj);

    // remove selected staff member
    appObj.staffMemberSelected  = undefined
}

/** Handle member is late functionality inside StaffMember objects.
 *  Display toast after timeout if staffmember status not "In"
 * 
 * @param {StaffMember} staffObj 
 */
function staffMemberIsLate(staffObj){

    const toastContainer = $(jqSelectors.TOAST_CONTAINER);  // get toast container
    const toastId = `toast-${staffObj.name}-${Date.now()}`; // create toast elem id

    // create toast
    const toast = 
        `<div class='toast show' id="${toastId}">` +
            "<div class='toast-header'>" +
                "<strong class='me-auto'>Staff Member Late</strong>" +
                "<button type='button' class='btn-close' data-bs-dismiss='toast'></button>" +
            "</div>" +
            "<div class='toast-body'>" +
                `<p> ${staffObj.name} ${staffObj.surname} seems to be running late</p>` +
            "</div>" +
        "</div>";

    // get sleep time for timeout
    const sleep = staffObj.expectedReturnTime.getTime() - obj.outTime.getTime();

    // set timeout
    setTimeout(() => {
        if (obj.status === "In") return // return void if status equals In
        toastContainer.append(toast)    // else append toast to container
    }, sleep)
}

/** 
 *  Get form data from schedule delivery form and validate.
 *  If data is valid, create DeliveryDriver object and repopulate delivery board.
 * 
 * @remark returns boolean value false to bypass page reload on submit
 * 
 * @param {Application} appObj application object
 */
function addDelivery(appObj) {
    // running try catch block to get any code error,
    // rather than page reload when error occures
    try {
        // create input fields from form
        const fields = {
            vehichle:    new InputField(jqSelectors.INPUT_VEHICLE),
            name:        new InputField(jqSelectors.INPUT_NAME),
            surname:     new InputField(jqSelectors.INPUT_SURNAME),
            telephone:   new InputField(jqSelectors.INPUT_TELEPHONE),
            address:     new InputField(jqSelectors.INPUT_ADDRESS),
            return_time: new InputField(jqSelectors.INPUT_RETURN_TIME),
        }  

        // remove any existing errors in form
        Object.keys(fields).map(x => {
            fields[x].removeError()
        })

        const formValid = validateDelivery(fields)  // validate form fields 
        if (!formValid) return false;               // return if data not valid

        // create data object
        const delivery = new DeliveryDriver(
            fields.name.value,
            fields.surname.value,
            fields.vehichle.value,
            fields.telephone.value,
            fields.address.value,
            fields.return_time.value,
            appObj,
        )
        
        // add object to delivery data array
        appObj.addDelivery(delivery)

        // update delivery board
        const rows = createDeliveryDriverTableRow(appObj)
        populateDeliveryDriverBoard(rows, appObj)
        
        // reset all fields in form
        Object.keys(fields).map(key => {
            fields[key].reset()
        })
        
        // return false to bypass page reload on submit
        return false

    } catch (ex) {
        console.error(ex)   //  catch any 
    } finally {
        return false        // ensure always return false
    }


}

/** 
 *  Validate input values to a set of rules.
 *  Adds error css class to element if field is invalid
 * 
 * @param {InputField[]} fields list of field objects
 * @returns true if all field values are valid
 */
function validateDelivery(fields) {
    
    // string not empty rule
    const stringNotEmpty = value => !value ? "Missing value" : "";
    // is number, spaces allowed
    const isNumber = value => /^(\d+\s)*(\d+)$/.test(value) ? "" : "Not a number";
    // check time has valid format
    // REMARK: Redundant since input type return this format
    const validTimeFormat = value => /\d\d\:\d\d/.test(value) ? "" : "Not valid time format";
    // check if provided datetime value is later than current datetime
    const isLater = value => {
        const now = new Date().toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
        const validLater = now < value;
        return validLater ? "" : "Return time to early";
    }

    // check all fields for empty string
    const containError = Object.keys(fields).filter(key => {
        const res = fields[key].validate(stringNotEmpty);
        if (!res) return true;
    })

    // if not empty, check if phonenumber valid
    let validNumber = false;
    if (!containError.includes("telephone")) validNumber = fields.telephone.validate(isNumber);

    // if not empty, check if timefield has right format
    // if still valid, check if time is later than current
    let validReturn = false;
    if (!containError.includes("return_time")) {
        validReturn = fields.return_time.validate(validTimeFormat);
        if (validReturn) validReturn = fields.return_time.validate(isLater);
    };

    // return on condition of all validations
    return containError.length === 0 && validNumber && validReturn;
}

/** Handle driver is late event for delivery driver
 * Appends toast to container if delivery still active on timeout
 * 
 * @param {DeliveryDriver} delivery delivery driver object
 * @param {Application} appObj application object
 */
function deliveryIsLate(delivery, appObj) {

    const toastContainer = $(jqSelectors.TOAST_CONTAINER);  // create toast container
    const toastId = `toast-${delivery.name}-${Date.now()}`; // generate toast elem id

    // create toast
    const toast = 
        `<div class='toast show' id="${toastId}">` +
            "<div class='toast-header'>" +
                "<strong class='me-auto'>Delivery Driver Late</strong>" +
                "<button type='button' class='btn-close' data-bs-dismiss='toast'></button>" +
            "</div>" +
            "<div class='toast-body'>" +
                `<p> ${delivery.name} ${delivery.surname} seems to be running late</p>` +
            "</div>" +
        "</div>";

    // create sleep time for timeout
    const now = Date.now();
    const later = new Date();
    later.setHours(parseInt(delivery.returnTime.split(":")[0]));
    later.setMinutes(parseInt(delivery.returnTime.split(":")[1]));
    const sleep = later.getTime() - now;


    setTimeout(() => {
        // check if object still exist in data
        const shouldRun = appObj.deliveries.find(x => x.telephone === delivery.telephone);

        if (!shouldRun) return;         // return void if toast not relevant
        toastContainer.append(toast)    // else append toast to container
    }, sleep)
}

/** Handle clear delivery event.
 *  Removes selected DeliveryDriver object from dataset
 *  after confirm from user
 * 
 * @param {Application} appObj 
 */
function clearDelivery(appObj) {

    const selected = appObj.deliverySelected; 
    if (!selected) return;                      // return if not selected
    
    // get user confimation to remove delivery
    const shouldRemove = confirm("Do you want to remove this delivery?");
    if (!shouldRemove) return;

    // remove selected delivyer object
    appObj.removeDeliveries(selected);

    // repopulate delivery board
    const elems = createDeliveryDriverTableRow(appObj);
    populateDeliveryDriverBoard(elems, appObj);
}

/** function for digial clock  */
function digitalClock() {
    setInterval(() => {

        // get element
        const elem = $(jqSelectors.CLOCK_ELEM)
        // get current date and time
        const date = new Date()

        // get date string
        const dateString = date.toLocaleDateString("en-GB", {day: "2-digit", month: "long", year: "numeric"});

        // get time only
        const timeString = date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit", second: "2-digit"});

        // create and output datetime string to element
        elem.text(`${dateString} ${timeString}`);

    }, 1000)
}


/*  === APPLICATION STARTS HERE :) == */

// Ready function for jQuery added but disabled since it has depricated ages ago
// Reference: https://api.jquery.com/ready/
// Function also redundant since defer attribute in script import ensures js loads after document

// $(document).ready(() => console.warn("depricated"))

const app = new Application();  // create application instance
app.run()                       // run application


