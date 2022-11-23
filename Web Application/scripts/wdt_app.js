
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
    DELIVERY_ADD: "#delivery-add",
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
    
}


function createAppDataContainer() {
    let staffMembers = []
    let selectedStaffMember = undefined

    return {

        getStaffMembers() { return staffMembers },
        setStaffMembers(array) { staffMembers = array },

        getSelectedStaffMember() { return selectedStaffMember},
        setSelectedStaffMember(member) { selectedStaffMember = member},
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
            `<td> ${s.outTime ? s.outTime.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit"}) : "" }</td>` +
            `<td> ${s.duration ? s.duration : ""} </td>` +
            `<td> ${s.expectedReturnTime ? s.expectedReturnTime.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit"}) : ""} </td>` +
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

        elem.removeClass().click(() => {

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
    const toastId = `toast-${obj.email}-${Date.now()}`

    const toast = 
        `<div class='toast show' id="${toastId}">` +
        "<div class='toast-header'>" +
        "<strong class='me-auto'>Staff Member late</strong>" +
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



function addDelivery() {

}

function validateDelivery() {

}

function deliveryIsLate() {

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

$(jqSelectors.DELIVERY_ADD).click(() => {
    staffMemberIsLate("Kristian", "Hansen")
})
