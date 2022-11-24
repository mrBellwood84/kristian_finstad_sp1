
/** container for app configurations */
const config = {
    API_URL: "https://randomuser.me/api/?results=5&nat=gb,us,no&inc=name,email,picture",
}

/** container for jQuery selector strings */
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

/** base class for employee */
class Employee {

    constructor(name, surname) {
        this.name       = name;
        this.surname    = surname;
    }
}

/** staff member class */
class StaffMember extends Employee {

    outTime             = undefined;
    duration            = undefined;
    expectedReturnTime  = undefined;

    constructor(name, surname, email, picture) {

        super(name, surname)

        this.email      = email;
        this.picture    = picture;
        this.status     = "In";
    }

    staffMemberIsLate() {
        staffMemberIsLate(this)
    }
}

class DeliveryDriver extends Employee {
    constructor(name, surname, vehichle, telephone, address, return_time) {
        super(name, surname);
        this.vehichle = vehichle;
        this.telephone = telephone;
        this.address = address;
        this.returnTime = return_time;
        
        this.deliveryIsLate()
    }

    deliveryIsLate() {
        deliveryIsLate(this)
    }
}

class InputField {
    
    constructor(jqSelector) {
        this.field = $(jqSelector);
        this.errorField = $(`${jqSelector}-error`);
        this.value = this.field.val();
    }

    /**
     * @param {() => string} callback function for validating value, return message string, empty if valid
     * @returns true if value is valid
     */
    validate(callback) {
        const message = callback(this.value);
        const isValid = message === "";
        if (!isValid) this.setError(message)
        return isValid
    }

    setError(message) {
        this.field.addClass("field-error")
        this.errorField.text(message)
    }
    removeError() {
        this.field.removeClass("field-error")
        this.errorField.text("")
    }

    reset() {
        this.field.val("")
    }
}

function createAppDataContainer() {
    let staffMembers = []
    let selectedStaffMember = undefined
    let deliveries = []
    let selectedDelivery = undefined;

    return {

        getStaffMembers() { return staffMembers },
        setStaffMembers(array) { staffMembers = array },

        getSelectedStaffMember() { return selectedStaffMember},
        setSelectedStaffMember(member) { selectedStaffMember = member},

        getDeliveries() { return deliveries },
        addDelivery(item) { deliveries.push(item) },
        removeDelivery(item) {
            deliveries = [...deliveries].filter(x => x !== item);
        },

        getSelectedDelivery() { return selectedDelivery },
        setSelectedDelivery(delivery) { selectedDelivery = delivery}
    }
}

function createStaffTableRow(staffMemberList) {
    let id = 1
    const result = staffMemberList.map(s => {    
        const elem = `<tr class="dashboard-staff-table-row" id="staffmember-${id++}">`+
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

function populateStaffTable(rows, setSelectedStaffMember) {
    const table = $(jqSelectors.STAFF_TABLE)
    table.empty()
    rows.map(x => {
        table.append(x)
    })

    const r = table.children();
    r.map(i => {

        const selector = r[i].id
        const elem = $(`#${selector}`);

        elem.removeClass("row-selected").click(() => {

            const email = r[i].children[3].innerText
            const obj = appData.getStaffMembers().find(x => x.email === email)
            const selected = appData.getSelectedStaffMember()

            if (selected) {
                if (selected.email === email) {
                    setSelectedStaffMember(undefined)
                    elem.removeClass("row-selected")
                } else {
                    r.map(x => {
                        const e = `#${r[x].id}`;
                        $(e).removeClass("row-selected")
                    })
                    elem.addClass("row-selected")
                    setSelectedStaffMember(obj)
                }
            }
            else {
                elem.addClass("row-selected")
                setSelectedStaffMember(obj)
            }
        })
    })
}

/**
 * 
 * @param {() => void } setStaffData callback for storing staff data in object
 * @param {() => void } setSelectedStaffMember callback for storing selected staff member object
 */
function staffUserGet(setStaffData, setSelectedStaffMember) {

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

        setStaffData(staffMembers)

        // create table rows for each staff member
        const rows = createStaffTableRow(staffMembers);

        // insert data to table
        populateStaffTable(rows, setSelectedStaffMember)
        setStaffData(staffMembers)
        
    }) 

    request.open("GET", config.API_URL, true);
    request.send();
}

function staffOut() {
    const selected = appData.getSelectedStaffMember();
    const allStaff = appData.getStaffMembers();
    if (!selected) return;
    if (selected.status === "Out") return

    let time = undefined;
    while (true) {
        let userInput = prompt("Set staff out time in minutes");
        if (userInput === null) break;
        time = parseInt(userInput);
        if (!isNaN(time)) break;
    }

    if (time <= 0 || isNaN(time) || !time) return;

    const now = new Date();
    const back = new Date();
    back.setMinutes(now.getMinutes() + time);

    const hours = Math.floor(time / 60);
    const minutes = time - (hours * 60);

    const hourString = hours > 0 ? `${hours} hour, ` : "";

    const duration = `${hourString}${minutes} minutes`;

    selected.status = "Out";
    selected.outTime = now;
    selected.expectedReturnTime = back;
    selected.duration = duration;
    
    selected.staffMemberIsLate()

    const staffElements = createStaffTableRow(allStaff);
    populateStaffTable(staffElements, appData.setSelectedStaffMember);
    appData.setSelectedStaffMember(undefined);
}

function staffIn() {
    const selected = appData.getSelectedStaffMember();
    const allStaff = appData.getStaffMembers();

    if (!selected) return;
    if (selected.status === "In") return;

    selected.status = "In";
    selected.outTime = undefined;
    selected.duration = undefined;
    selected.expectedReturnTime = undefined;

    const staffElements = createStaffTableRow(allStaff);
    populateStaffTable(staffElements, appData.setSelectedStaffMember);
    appData.setSelectedStaffMember(undefined)
}

/** 
 * Standalone function contain functionality for toast alert to end user.
 * Similar named method in class run timeout loop and decide if toast is to be printed to page.
 * 
 * @remarks Creating this as a standalone function was after consulting a teacher asking if 
 * all required functions in the grading criteria was supposed to be standalone functions of included
 * in classes as methods.
 * */
function staffMemberIsLate(obj){

    const toastContainer = $(jqSelectors.TOAST_CONTAINER);
    const toastId = `toast-${obj.name}-${Date.now()}`

    const toast = 
        `<div class='toast show' id="${toastId}">` +
        "<div class='toast-header'>" +
        "<strong class='me-auto'>Staff Member Late</strong>" +
        "<button type='button' class='btn-close' data-bs-dismiss='toast'></button>" +
        "</div>" +
        "<div class='toast-body'>" +
        `<p> ${obj.name} ${obj.surname} seems to be running late</p>` +
        "</div>" +
        "</div>";

    const sleep = obj.expectedReturnTime.getTime() - obj.outTime.getTime();

    setTimeout(() => {
        if (obj.status === "In") return
        toastContainer.append(toast)
        
    }, sleep)
}

function createDeliveryDriverTableRow(deliveryDriverList) {
    let id = 1;
    const result = deliveryDriverList.map(d => {
        const svg = d.vehichle === "car" ? "./resources/car-front-fill.svg"  : "./resources/bicycle.svg"
        const elem = `<tr class="dashboard-delivery-table-row" id="delivery-driver-${id++}">` +
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

function populateDeliveryDriverBoard(rows, setSelectedDelivery) {
    const table = $(jqSelectors.DELIVERY_BOARD);
    table.empty();
    rows.map(r => table.append(r))

    const r = table.children()
    r.map(i => {

        const selector = r[i].id;
        const elem = $(`#${selector}`);

        elem.removeClass("row-selected").click(() => {
            const phone = r[i].children[3].innerText;
            const obj = appData.getDeliveries().find(x => x.telephone === phone)
            const selected = appData.getSelectedDelivery();


            if (selected) {
                if (selected.telephone === phone) {
                    setSelectedDelivery(undefined)
                    elem.removeClass("row-selected")
                } else {
                    r.map(x => {
                        const e = `#${r[x].id}`;
                        $(e).removeClass("row-selected")
                    })
                    elem.addClass("row-selected")
                    setSelectedDelivery(obj)
                }
            } else {
                elem.addClass("row-selected")
                setSelectedDelivery(obj)
            }
        })
    })
}

function addDelivery(appData) {
    const fields = {
        vehichle:    new InputField(jqSelectors.INPUT_VEHICLE),
        name:        new InputField(jqSelectors.INPUT_NAME),
        surname:     new InputField(jqSelectors.INPUT_SURNAME),
        telephone:   new InputField(jqSelectors.INPUT_TELEPHONE),
        address:     new InputField(jqSelectors.INPUT_ADDRESS),
        return_time: new InputField(jqSelectors.INPUT_RETURN_TIME),
    }  

    Object.keys(fields).map(x => {
        fields[x].removeError()
    })

    const formValid = validateDelivery(fields)

    if (!formValid) return false; 

    const delivery = new DeliveryDriver(
        fields.name.value,
        fields.surname.value,
        fields.vehichle.value,
        fields.telephone.value,
        fields.address.value,
        fields.return_time.value
    )

    appData.addDelivery(delivery)
    const rows = createDeliveryDriverTableRow(appData.getDeliveries())
    populateDeliveryDriverBoard(rows, appData.setSelectedDelivery)

    Object.keys(fields).map(key => {
        fields[key].reset()
    })
    
    return false

}

function validateDelivery(fields) {
    
    const stringNotEmpty = value => !value ? "Missing value" : "";
    const isNumber = value => /^(\d+\s)*(\d+)$/.test(value) ? "" : "Not a number";
    const validTimeFormat = value => /\d\d\:\d\d/.test(value) ? "" : "Not valid time format";
    const isLater = value => {
        const now = new Date().toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
        const validLater = now < value;
        return validLater ? "" : "Return time to early";
    }
    
        
    const containError = Object.keys(fields).filter(key => {
        const res = fields[key].validate(stringNotEmpty);
        if (!res) return true;
    })

    let validNumber = false;
    if (!containError.includes("telephone")) validNumber = fields.telephone.validate(isNumber);

    let validReturn = false;
    if (!containError.includes("return_time")) {
        validReturn = fields.return_time.validate(validTimeFormat);
        if (validReturn) validReturn = fields.return_time.validate(isLater);
    };

    return containError.length === 0 && validNumber && validReturn;

}

function deliveryIsLate(obj) {
    const toastContainer = $(jqSelectors.TOAST_CONTAINER);
    const toastId = `toast-${obj.name}-${Date.now()}`

    const toast = 
        `<div class='toast show' id="${toastId}">` +
            "<div class='toast-header'>" +
                "<strong class='me-auto'>Delivery Driver Late</strong>" +
                "<button type='button' class='btn-close' data-bs-dismiss='toast'></button>" +
            "</div>" +
            "<div class='toast-body'>" +
                `<p> ${obj.name} ${obj.surname} seems to be running late</p>` +
            "</div>" +
        "</div>";

        const now = Date.now()
        const later = new Date()
        later.setHours(parseInt(obj.returnTime.split(":")[0]))
        later.setMinutes(parseInt(obj.returnTime.split(":")[1]))

        const sleep = later.getTime() - now;

        setTimeout(() => {
            const shouldRun = appData.getDeliveries().find(x => x.telephone === obj.telephone)
            if (!shouldRun) return;
            toastContainer.append(toast)
            
        }, sleep)
}

function clearDelivery() {
    const selected = appData.getSelectedDelivery();
    if (!selected) return
    
    const shouldRemove = confirm("Do you want to remove this delivery?");
    if (!shouldRemove) return;

    appData.removeDelivery(selected);
    const elems = createDeliveryDriverTableRow(appData.getDeliveries());
    populateDeliveryDriverBoard(elems, appData.setSelectedDelivery)

}

/** function for digial clock  */
function digitalClock() {
    setInterval(() => {

        // get element
        const elem = $(jqSelectors.CLOCK_ELEM)
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
        elem.text(output);

    }, 1000)
}


/*  --application starts here -- */

/** create storage for app data */
const appData = createAppDataContainer();

// download user data and populate table
staffUserGet(appData.setStaffMembers, appData.setSelectedStaffMember)

digitalClock()

$(jqSelectors.STAFF_OUT_BTN).click(staffOut)
$(jqSelectors.STAFF_IN_BTN).click(staffIn)

$(jqSelectors.DELIVERY_FORM).submit(() => addDelivery(appData))

$(jqSelectors.DELIVERY_CLEAR_BUTTON).click(clearDelivery)
