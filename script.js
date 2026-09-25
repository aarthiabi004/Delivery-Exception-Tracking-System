// Get elements from HTML

const form = document.getElementById("exceptionForm");
const table = document.getElementById("exceptionTable");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalIssues = document.getElementById("totalIssues");
const pendingIssues = document.getElementById("pendingIssues");
const progressIssues = document.getElementById("progressIssues");
const resolvedIssues = document.getElementById("resolvedIssues");


// Get existing data from Local Storage

let exceptions = JSON.parse(localStorage.getItem("exceptions")) || [];


// Display data when page loads

displayExceptions();


// Add new exception

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const orderId = document.getElementById("orderId").value.trim();
    const customerName = document.getElementById("customerName").value.trim();
    const location = document.getElementById("location").value.trim();
    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value.trim();

    const newException = {

        id: Date.now(),

        orderId: orderId,

        customerName: customerName,

        location: location,

        issueType: issueType,

        description: description,

        status: "Pending",

        date: new Date().toLocaleDateString()

    };

    exceptions.push(newException);

    saveData();

    displayExceptions();

    form.reset();

    alert("Delivery exception added successfully!");

});


// Display exceptions

function displayExceptions() {

    table.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredExceptions = exceptions.filter(function (item) {

        const matchesSearch =
            item.orderId.toLowerCase().includes(searchText) ||
            item.customerName.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            item.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });


    filteredExceptions.forEach(function (item) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${item.orderId}</td>

            <td>${item.customerName}</td>

            <td>${item.location}</td>

            <td>${item.issueType}</td>

            <td>${item.description}</td>

            <td>

                <select
                    class="status-select"
                    onchange="changeStatus(${item.id}, this.value)"
                >

                    <option value="Pending"
                        ${item.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${item.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${item.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

            </td>

            <td>${item.date}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteException(${item.id})"
                >
                    Delete
                </button>

            </td>

        `;

        table.appendChild(row);

    });

    updateDashboard();

}


// Change status

function changeStatus(id, newStatus) {

    exceptions = exceptions.map(function (item) {

        if (item.id === id) {

            item.status = newStatus;

        }

        return item;

    });

    saveData();

    displayExceptions();

}


// Delete exception

function deleteException(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this exception?"
    );

    if (!confirmation) {
        return;
    }

    exceptions = exceptions.filter(function (item) {

        return item.id !== id;

    });

    saveData();

    displayExceptions();

}


// Search

searchInput.addEventListener("input", function () {

    displayExceptions();

});


// Filter

statusFilter.addEventListener("change", function () {

    displayExceptions();

});


// Update dashboard numbers

function updateDashboard() {

    totalIssues.textContent = exceptions.length;

    const pending = exceptions.filter(function (item) {

        return item.status === "Pending";

    });

    const progress = exceptions.filter(function (item) {

        return item.status === "In Progress";

    });

    const resolved = exceptions.filter(function (item) {

        return item.status === "Resolved";

    });

    pendingIssues.textContent = pending.length;

    progressIssues.textContent = progress.length;

    resolvedIssues.textContent = resolved.length;

}


// Save data

function saveData() {

    localStorage.setItem(
        "exceptions",
        JSON.stringify(exceptions)
    );

}
