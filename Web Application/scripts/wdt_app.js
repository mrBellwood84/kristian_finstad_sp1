/*
 *                                  --== WDT Appication ==--
 * 
 *  Created after specification as provided in the semester project assignment document.
 * 
 *  Since application is to follow the OOP paradigm, the application is run from a main application class.
 *  It is required to create an instance of the class and call the run function.
 * 
 * 
 *  REMARKS:    All functions mentioned under section of the grading criteria is created as standalone functions.
 *              This decition was made after consulting with a teacher indicated this was expected.
 *              I would have preferd to have written these as methods inside the application class or a nested class within
 *              the application class to encapsulate data and methods as such only run method is globally accessable.
 *              To remedy this, I have created all functions in light of easy refactoring to class methods by removing "appObj" as 
 *              input parameters and and change reference to "this" inside the functions.
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

    MODAL_SET_TIME: "#staff-member-set-time-modal",
    MODAL_SET_TIME_NAME_ELEM: "#staff-memeber-set-time-modal-name",
    MODAL_SET_TIME_OK_BTN: "#staff-member-set-time-modal-ok-btn",
    MODAL_SET_TIME_CANCEL_BTN: "#staff-member-set-time-modal-cancel-btn",
    MODAL_SET_TIME_OUT_FIELD: "#staff-memeber-out-field",

    MODAL_CLEAR_DELIVERY: "#delivery-clear-modal",
    MODAL_CLEAR_DELIVERY_YES: "#delivery-clear-modal-yes-btn",
    MODAL_CLEAR_DELIVERY_NO: "#delivery-clear-modal-no-btn",
    MODAL_CLEAR_DELIVERY_NAME: "#delivery-clear-modal-name",
}

/** collection of svgs represented as strings */
const svgCollection = {
    /** car icons */

    car: {
        dark:   '<svg width="25" height="25" fill="#212529" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/>' +
                '</svg>',

        light:  '<svg width="25" height="25" fill="#fff" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/>' +
                '</svg>',
    },
    motorcycle: {
        dark:   '<svg width="25" height="25" fill="#212529" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M512.9 192c-14.9-.1-29.1 2.3-42.4 6.9L437.6 144H520c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24h-45.3c-6.8 0-13.3 2.9-17.8 7.9l-37.5 41.7-22.8-38C392.2 68.4 384.4 64 376 64h-80c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h66.4l19.2 32H227.9c-17.7-23.1-44.9-40-99.9-40H72.5C59 104 47.7 115 48 128.5c.2 13 10.9 23.5 24 23.5h56c24.5 0 38.7 10.9 47.8 24.8l-11.3 20.5c-13-3.9-26.9-5.7-41.3-5.2C55.9 194.5 1.6 249.6 0 317c-1.6 72.1 56.3 131 128 131 59.6 0 109.7-40.8 124-96h84.2c13.7 0 24.6-11.4 24-25.1-2.1-47.1 17.5-93.7 56.2-125l12.5 20.8c-27.6 23.7-45.1 58.9-44.8 98.2.5 69.6 57.2 126.5 126.8 127.1 71.6.7 129.8-57.5 129.2-129.1-.7-69.6-57.6-126.4-127.2-126.9zM128 400c-44.1 0-80-35.9-80-80s35.9-80 80-80c4.2 0 8.4.3 12.5 1L99 316.4c-8.8 16 2.8 35.6 21 35.6h81.3c-12.4 28.2-40.6 48-73.3 48zm463.9-75.6c-2.2 40.6-35 73.4-75.5 75.5-46.1 2.5-84.4-34.3-84.4-79.9 0-21.4 8.4-40.8 22.1-55.1l49.4 82.4c4.5 7.6 14.4 10 22 5.5l13.7-8.2c7.6-4.5 10-14.4 5.5-22l-48.6-80.9c5.2-1.1 10.5-1.6 15.9-1.6 45.6-.1 82.3 38.2 79.9 84.3z"/>' +
                '</svg>',
                
        light:  '<svg width="25" height="25" fill="#fff" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M512.9 192c-14.9-.1-29.1 2.3-42.4 6.9L437.6 144H520c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24h-45.3c-6.8 0-13.3 2.9-17.8 7.9l-37.5 41.7-22.8-38C392.2 68.4 384.4 64 376 64h-80c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h66.4l19.2 32H227.9c-17.7-23.1-44.9-40-99.9-40H72.5C59 104 47.7 115 48 128.5c.2 13 10.9 23.5 24 23.5h56c24.5 0 38.7 10.9 47.8 24.8l-11.3 20.5c-13-3.9-26.9-5.7-41.3-5.2C55.9 194.5 1.6 249.6 0 317c-1.6 72.1 56.3 131 128 131 59.6 0 109.7-40.8 124-96h84.2c13.7 0 24.6-11.4 24-25.1-2.1-47.1 17.5-93.7 56.2-125l12.5 20.8c-27.6 23.7-45.1 58.9-44.8 98.2.5 69.6 57.2 126.5 126.8 127.1 71.6.7 129.8-57.5 129.2-129.1-.7-69.6-57.6-126.4-127.2-126.9zM128 400c-44.1 0-80-35.9-80-80s35.9-80 80-80c4.2 0 8.4.3 12.5 1L99 316.4c-8.8 16 2.8 35.6 21 35.6h81.3c-12.4 28.2-40.6 48-73.3 48zm463.9-75.6c-2.2 40.6-35 73.4-75.5 75.5-46.1 2.5-84.4-34.3-84.4-79.9 0-21.4 8.4-40.8 22.1-55.1l49.4 82.4c4.5 7.6 14.4 10 22 5.5l13.7-8.2c7.6-4.5 10-14.4 5.5-22l-48.6-80.9c5.2-1.1 10.5-1.6 15.9-1.6 45.6-.1 82.3 38.2 79.9 84.3z"/>' +
                '</svg>',
    },
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

    // fields not required in constuctor
    outTime             = undefined;
    duration            = undefined;
    expectedReturnTime  = undefined;

    /**
     * @param {Object} inputObj must contain fields for name, surname, email and picture 
     * */
    constructor(inputObj) {

        super(inputObj.name, inputObj.surname)

        this.email      = inputObj.email;
        this.picture    = inputObj.picture;
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
     * @param {Object} inputObj Requre field for name, surname, vehicle, telephone, address and return time
     * @param {Application} appObj main class needed for delivery late functionality
     */
    constructor(inputObj, appObj) {
        super(inputObj.name, inputObj.surname);
        this.vehichle = inputObj.vehicle;
        this.telephone = inputObj.telephone;
        this.address = inputObj.address;
        this.returnTime = inputObj.return_time;
        
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
    reset() {
        this.removeError();
        this.field.val("");
    }
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

        $(jqSelectors.STAFF_OUT_BTN).click(() => handleSetStaffMemeberOutModalOpen(this));
        $(jqSelectors.STAFF_IN_BTN).click(() => staffIn(this));
        $(jqSelectors.DELIVERY_FORM).submit(() => addDelivery(this));
        $((jqSelectors.DELIVERY_CLEAR_BUTTON)).click(() => handleOpenClearDeliveryModal(this));

        $(jqSelectors.MODAL_SET_TIME_CANCEL_BTN).click(handleSetStaffMemeberOutModalClose);
        $(jqSelectors.MODAL_SET_TIME_OK_BTN).click(() => staffOut(this));
        $(jqSelectors.MODAL_SET_TIME_OUT_FIELD).keypress((event) => {
            const keycode = event.keyCode;
            if (keycode == "13") staffOut(this);
        });

        $(jqSelectors.MODAL_CLEAR_DELIVERY_YES).click(() => clearDelivery(this))
        $(jqSelectors.MODAL_CLEAR_DELIVERY_NO).click(() => handleCloseClearDeliveryModal(this));

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


//  == SEPARATED FUNCTIONS FOR REUASBILITY ==

/**
 * Produce table rows as strings for jQuery appending to table.
 * Require data added to application object.
 * 
 * @param {Application} appObj application object
 * @returns string array representing table rows
 */
function createStaffTableRow(appObj) {
    const result = appObj.staffMembers.map(s => {    
        const elem = 
            `<tr class="dashboard-staff-table-row" id="staffmember-${generateUniqeId()}">`+
                `<td><img src=${s.picture} class="rounded-3" alt="thumbnail"></td>`+
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

        elem.removeClass("row-selected")
        
            .click(() => {

                // decleared in scope due to unexpected experiences
                const selected = appObj.staffMemberSelected;
                const email = r[i].children[3].innerText
                const self = appObj.staffMembers.find(x => x.email === email)

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
            
            .dblclick(() => {

                // declared in scope due to unexpected occurences
                const email = r[i].children[3].innerText
                const self = appObj.staffMembers.find(x => x.email === email)
            
                elem.addClass("row-selected");
                appObj.staffMemberSelected = self;
                handleSetStaffMemeberOutModalOpen(appObj)
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
    const result = appObj.deliveries.map(d => {
        const svg = d.vehichle === "car" ? svgCollection.car.dark : svgCollection.motorcycle.dark;
        const elem = 
            `<tr class="dashboard-delivery-table-row" id="delivery-driver-${generateUniqeId()}">` +
                `<td>${svg}</td>` +
                `<td>${d.name}</td>` +
                `<td>${d.surname}</td>` +
                `<td>${d.telephone}</td>` +
                `<td>${d.address}</td>` +
                `<td>${d.returnTime}</td>` +
            "</tr>";
        return elem;
    });
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

        const phone = r[i].children[3].innerText;
        const self = appObj.deliveries.find(x => x.telephone === phone);
        const selected = appObj.deliverySelected;

        elem.removeClass("row-selected")

            .click(() => {

                // decleared in scope due to unexpected behaviour
                const phone = r[i].children[3].innerText;
                const self = appObj.deliveries.find(x => x.telephone === phone);
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
            
            .dblclick(() => {
                
                // decleared in scope due to unexpected behaviour
                const phone = r[i].children[3].innerText;
                const self = appObj.deliveries.find(x => x.telephone === phone);

                elem.addClass("row-selected");
                appObj.deliverySelected = self;
                handleOpenClearDeliveryModal(appObj);
        });
    });
}

/** generates an uniqe identitfier to be used for element id's */
function generateUniqeId() {
    return Math.ceil((10**10) + Math.random() * 0x100000 ).toString(16).substring(1);
}

/** 
 *  Create and add toast to document
 * 
 * @param {string} imageElem image element represented as string
 * @param {string} headerText header text
 * @param {string} bodyElems body elements represented as string
 */
function createToast(imageElem, headerText, bodyElems) {
    const toastContainer = $(jqSelectors.TOAST_CONTAINER);  // get toast container
    const toastId = `toast-${generateUniqeId()}`;

    const toast =         
        `<div class='toast show' id='${toastId}'>` +
            "<div class='toast-header d-flex'>" +
                imageElem +
                `<strong class='p-2 me-auto'>${headerText}</strong>` +
                `<small id='${toastId}-time'>Now</small>` +
                "<button type='button' class='btn-close ml-auto' data-bs-dismiss='toast'></button>" +
            "</div>" +
            "<div class='toast-body'> " +
                bodyElems +
            "</div>" +
        "</div>";

    toastContainer.append(toast)

    const toastTimer = $(`#${toastId}-time`);
    let now = 0;

    setInterval(() => {
        now++;
        const hour = Math.floor(now / 60)
        const min = now % 60
        const hour_str = hour > 0 ? `${hour} ${hour > 1 ? "hours" : "hour"}` : "";
        const minute_str = min > 0 ? `${min} ${min > 1 ? "minutes" : "minute"}` : "";
        toastTimer.text(`${hour_str} ${minute_str} ago`);

    }, 60000)
}

/**
 * Handle click for Staff member out button.
 * Opens dialog if staff memeber selected
 * 
 * @param {Application} appObj 
 */
function handleSetStaffMemeberOutModalOpen(appObj) {
    if (!appObj.staffMemberSelected) return;
    if (appObj.staffMemberSelected.status === "Out") return;
    const _ = new InputField(jqSelectors.MODAL_SET_TIME_OUT_FIELD).reset();
    $(jqSelectors.MODAL_SET_TIME_OUT_FIELD).select
    $(jqSelectors.MODAL_SET_TIME_NAME_ELEM).text(`${appObj.staffMemberSelected.name} ${appObj.staffMemberSelected.surname}`);
    $(jqSelectors.MODAL_SET_TIME).modal("show");
}

/** Handle close modal button click */
function handleSetStaffMemeberOutModalClose() {
    $(jqSelectors.MODAL_SET_TIME).modal("hide");
}

/**
 * Handle open clear delivery modal on button click
 * 
 * @param {Application} appObj 
 */
function handleOpenClearDeliveryModal(appObj) {
    if (!appObj.deliverySelected) return;
    $(jqSelectors.MODAL_CLEAR_DELIVERY_NAME).text(`${appObj.deliverySelected.name} ${appObj.deliverySelected.surname}`);
    $(jqSelectors.MODAL_CLEAR_DELIVERY).modal("show");
}

/**
 * Handle closing clear delivery modal.
 * Also unselect selected object.
 * 
 * @param {Application} appObj 
 */
function handleCloseClearDeliveryModal(appObj) {
    $(jqSelectors.MODAL_CLEAR_DELIVERY).modal("hide");
    const table = $(jqSelectors.DELIVERY_BOARD);
    const rows = table.children();

    rows.map(i => {
        const id = rows[i].id;
        const elem = $(`#${id}`);
        elem.removeClass("row-selected");
        appObj.deliverySelected = undefined;
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
            return new StaffMember({
                name: x.name.first,
                surname: x.name.last,
                email: x.email,
                picture: x.picture.thumbnail,
            });
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

    const inputField = new InputField(jqSelectors.MODAL_SET_TIME_OUT_FIELD);
    inputField.reset();

    // validate input field
    const stringNotEmpty = value => !value ? "Missing value" : "";
    const largerThanZero = value => value > 0 ? "" : "Not valid a valid number"
    let valid = inputField.validate(stringNotEmpty);
    if (!valid) return
    valid = inputField.validate(largerThanZero);
    if(!valid) return;

    const time = parseInt(inputField.value);

    const now = new Date()
    const later = new Date()
    later.setMinutes(later.getMinutes() + time);

    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const hour_str = hours > 0 ? `${hours} ${hours > 1 ? "hours" : "hour"}` : "";
    const minute_str = minutes > 0 ? `${minutes} ${minutes > 1 ? "minutes" : "minute"}` : "";
    const duration = `${hour_str}${hours > 0 && minutes > 0 ? ", " : ""}${minute_str}`;

    const selected = appObj.staffMemberSelected;

    // update object
    selected.status = "Out";
    selected.outTime = now;
    selected.expectedReturnTime = later;
    selected.duration = duration;
    
    // activate staff member is late
    selected.staffMemberIsLate();

    // repopulate table
    const staffElements = createStaffTableRow(appObj);
    populateStaffTable(staffElements, appObj);

    // remove selected staff member from app object
    appObj.staffMemberSelected = undefined;

    handleSetStaffMemeberOutModalClose()
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
function staffMemberIsLate(staffObj) {

    const image = `<img src="${staffObj.picture}" alt="staff picture" class="rounded">`

    const head = `${staffObj.name} ${staffObj.surname} is late`;

    const body = 
        `<p>${staffObj.name} ${staffObj.surname} has been out for ${staffObj.duration}</p>` +
        `<div>Go to <a href="#">Dashboard</a></div>`

    // get sleep time for timeout
    const sleep = staffObj.expectedReturnTime.getTime() - staffObj.outTime.getTime();

    // set timeout
    setTimeout(() => {
        if (staffObj.status === "In") return;       // return void if status equals "In"
        createToast(image, head, body);  // create toast
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

        // validate form
        const formValid = validateDelivery(fields)  // validate form fields 
        if (!formValid) return false;               // return if data not valid

        // create data object
        const delivery = new DeliveryDriver({
                name: fields.name.value,
                surname: fields.surname.value,
                vehicle: fields.vehichle.value,
                telephone: fields.telephone.value,
                address: fields.address.value,
                return_time: fields.return_time.value,
            }, appObj,
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

    const image = delivery.vehichle === "car" ? svgCollection.car.light : svgCollection.motorcycle.light;

    const header = `Delivery Driver Not Returned`;

    const body = 
        `<div>Driver: ${delivery.name} ${delivery.surname}</div>` +
        `<div>Driver telephone: ${delivery.telephone}</div>` + 
        `<div>Address: ${delivery.address}</div>` + 
        `<p>Estimated return: ${delivery.returnTime}</p>` +
        `<div>Go to <a href="#">Dashboard</a></div>`


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

        createToast(image, header, body)

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
    
    // remove selected delivyer object
    appObj.removeDeliveries(selected);

    // repopulate delivery board
    const elems = createDeliveryDriverTableRow(appObj);
    populateDeliveryDriverBoard(elems, appObj);

    handleCloseClearDeliveryModal(appObj);
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
