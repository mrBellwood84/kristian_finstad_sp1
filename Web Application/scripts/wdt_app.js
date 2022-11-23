
/** container for app configurations */
const config = {
    API_URL: "https://randomuser.me/api/?results=5",
}

/** container for jQuery selector strings */
const jqSelectors = {
    CLOCK_ELEM: "#clock-container",
    STAFF_TABLE: "#dashboard-staff-table tbody",
    STAFF_IN_BTN: "#staff-in-button",   
    STAFF_OUT_BT: "#staff-out-button",
    STAFF_ROW: ".dashboard-staff-table-row",
}

/** container for application data */
class AppData {
    constructor () {
        this.staff = []
        this.selectedStaff = undefined
    }


    setStaffMembers(array) { this.staff = array} 
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
}

class DeliveryDriver {
    
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


function createStaffTableRow(staffMember, id) {
    const elem = `<tr class="dashboard-staff-table-row" id="staffmember-${id}">`+
    `<td><img src=${staffMember.picture} alt="thumbnail"></td>`+
    `<td> ${staffMember.name} </td>` +
    `<td> ${staffMember.surname} </td>` +
    `<td> ${staffMember.email} </td>` +
    `<td> ${staffMember.status} </td>` +
    `<td> ${staffMember.outTime ? staffMember.outTime : "" }</td>` +
    `<td> ${staffMember.duration ? staffMember.duration : ""} </td>` +
    `<td> ${staffMember.expectedReturnTime ? staffMember.expectedReturnTime : ""} </td>` +
    "</tr>"
    return elem;
}


function populateStaffTable(rows, setSelectedStaffMember) {
    const table = $(jqSelectors.STAFF_TABLE)
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
        let idCounter = 0;
        const rows = staffMembers.map(x => createStaffTableRow(x, idCounter++));

        // insert data to table
        populateStaffTable(rows, setSelectedStaffMember)
        setStaffData(staffMembers)
        
    }) 

    request.open("GET", config.API_URL, true);
    request.send();
}


function staffOut() {
    const staffSelected = appData.getSelectedStaffMember();
    console.log(staffSelected)
}

function staffMemberIsLate(){

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


const appData = createAppDataContainer();

staffUserGet(appData.setStaffMembers, appData.setSelectedStaffMember)


digitalClock()


$(jqSelectors.STAFF_IN_BTN).click(staffOut)
