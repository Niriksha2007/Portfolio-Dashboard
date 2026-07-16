/*=========================================================
    DIGITAL ENTERPRISE
    COE PORTFOLIO COMMAND CENTER
    DASHBOARD SCRIPT
=========================================================*/

"use strict";

/*=========================================================
DOM READY
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

/*=========================================================
INITIALIZE
=========================================================*/

function initializeDashboard() {

    showLoader();

    updateLastRefresh();

    initializePortfolioChart();

    animateCounters();

    initializeCards();

    initializeButtons();

}

/*=========================================================
LOADER
=========================================================*/

function showLoader() {

    const loader = document.getElementById("loader");

    if (!loader) return;

    loader.style.display = "flex";

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 400);

    }, 1200);

}

/*=========================================================
LAST REFRESH
=========================================================*/

function updateLastRefresh() {

    const label = document.getElementById("lastRefresh");

    if (!label) return;

    const now = new Date();

    label.innerHTML = now.toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    });

}

/*=========================================================
CHART.JS
=========================================================*/

function initializePortfolioChart() {

    const canvas = document.getElementById("portfolioChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "On Track",

                "Delayed",

                "At Risk",

                "Done",

                "On Hold",

                "Not Started"

            ],

            datasets: [

                {

                    data: [

                        24,

                        11,

                        20,

                        24,

                        6,

                        14

                    ],

                    backgroundColor: [

                        "#16A34A",

                        "#F59E0B",

                        "#DC2626",

                        "#2563EB",

                        "#64748B",

                        "#CBD5E1"

                    ],

                    borderColor: "#FFFFFF",

                    borderWidth: 4,

                    hoverOffset: 12

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    backgroundColor: "#0F172A",

                    titleColor: "#FFFFFF",

                    bodyColor: "#FFFFFF",

                    padding: 14,

                    cornerRadius: 12,

                    displayColors: true

                }

            },

            animation: {

                animateRotate: true,

                animateScale: true,

                duration: 1500,

                easing: "easeOutQuart"

            }

        }

    });

}

/*=========================================================
COUNTER ANIMATION
=========================================================*/

function animateCounters() {

    const counters = document.querySelectorAll(

        ".top-metric h2, .portfolio-card h3, .metric-card h2"

    );

    counters.forEach(counter => {

        const original = counter.innerText.trim();

        const numeric = parseFloat(

            original.replace(/[^\d.]/g, "")

        );

        if (isNaN(numeric)) {

            return;

        }

        const hasCr = original.includes("Cr");

        const hasPercent = original.includes("%");

        const hasRupee = original.includes("₹");

        let current = 0;

        const increment = numeric / 60;

        const timer = setInterval(() => {

            current += increment;

            if (current >= numeric) {

                current = numeric;

                clearInterval(timer);

            }

            let value = Math.floor(current);

            if (hasCr) {

                counter.innerText = `₹${current.toFixed(1)} Cr.`;

            } else if (hasPercent) {

                counter.innerText = `${value}%`;

            } else if (hasRupee) {

                counter.innerText = `₹${value}`;

            } else {

                counter.innerText = value;

            }

        }, 20);

    });

}

/*=========================================================
CARD HOVER EFFECT
=========================================================*/

function initializeCards() {

    const cards = document.querySelectorAll(

        ".portfolio-card, .metric-card, .dashboard-card"

    );

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transition = "all .35s ease";

        });

    });

}

/*=========================================================
BUTTON RIPPLE
=========================================================*/

function initializeButtons() {

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {

        button.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            const rect = this.getBoundingClientRect();

            ripple.style.left =

                e.clientX - rect.left + "px";

            ripple.style.top =

                e.clientY - rect.top + "px";

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

}
/*=========================================================
SIDEBAR TOGGLE
=========================================================*/

function initializeSidebar() {

    const sidebar = document.querySelector(".sidebar");

    const toggle = document.getElementById("menuToggle");

    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/*=========================================================
MOBILE MENU CLOSE
=========================================================*/

document.addEventListener("click", (e) => {

    const sidebar = document.querySelector(".sidebar");

    const toggle = document.getElementById("menuToggle");

    if (!sidebar || !toggle) return;

    if (

        window.innerWidth <= 768 &&

        !sidebar.contains(e.target) &&

        !toggle.contains(e.target)

    ) {

        sidebar.classList.remove("active");

    }

});

/*=========================================================
FILTERS
=========================================================*/

function initializeFilters() {

    const selects = document.querySelectorAll(

        ".filter-box select"

    );

    selects.forEach(select => {

        select.addEventListener("change", () => {

            filterDashboard();

        });

    });

}

/*=========================================================
FILTER DASHBOARD
=========================================================*/

function filterDashboard() {

    const pod =
        document.getElementById("pod")?.value || "All";

    const stage =
        document.getElementById("stage")?.value || "All";

    const status =
        document.getElementById("status")?.value || "All";

    console.log("Filtering Dashboard");

    console.table({

        POD: pod,

        Stage: stage,

        Status: status

    });

    showToast("Dashboard filters applied");

}

/*=========================================================
RESET FILTERS
=========================================================*/

function initializeResetButton() {

    const reset = document.querySelector(".btn-outline");

    if (!reset) return;

    reset.addEventListener("click", () => {

        document
            .querySelectorAll(".filter-box select")
            .forEach(select => {

                select.selectedIndex = 0;

            });

        showToast("Filters reset");

    });

}

/*=========================================================
SEARCH (OPTIONAL)
=========================================================*/

function initializeSearch() {

    const search = document.getElementById("searchInput");

    if (!search) return;

    search.addEventListener("keyup", () => {

        const value =

            search.value.toLowerCase();

        const rows =

            document.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const text =

                row.innerText.toLowerCase();

            row.style.display =

                text.includes(value)

                    ? ""

                    : "none";

        });

    });

}

/*=========================================================
UPDATE KPI
=========================================================*/

function updatePortfolioStats(data) {

    document.querySelectorAll(".portfolio-card h3")
        .forEach((card, index) => {

            if (data[index] !== undefined) {

                card.innerText = data[index];

            }

        });

}

/*=========================================================
AUTO REFRESH TIME
=========================================================*/

setInterval(() => {

    updateLastRefresh();

}, 60000);

/*=========================================================
INITIALIZE EVENTS
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();

    initializeFilters();

    initializeResetButton();

    initializeSearch();

});

/*=========================================================
WINDOW RESIZE
=========================================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {

        document
            .querySelector(".sidebar")
            ?.classList.remove("active");

    }

});
/*=========================================================
ADD PROJECT MODAL
=========================================================*/

function initializeProjectModal() {

    const modal = document.getElementById("projectModal");

    const addButton = document.querySelector(".btn-primary");

    const closeButton = document.querySelector(".close-modal");

    const cancelButton = document.querySelector(".btn-secondary");

    if (!modal || !addButton) return;

    addButton.addEventListener("click", () => {

        modal.style.display = "flex";

        document.body.style.overflow = "hidden";

    });

    function closeModal() {

        modal.style.display = "none";

        document.body.style.overflow = "";

    }

    if (closeButton) {

        closeButton.addEventListener("click", closeModal);

    }

    if (cancelButton) {

        cancelButton.addEventListener("click", closeModal);

    }

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            closeModal();

        }

    });

}

/*=========================================================
TOAST NOTIFICATION
=========================================================*/

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    if (!toast) return;

    const text = toast.querySelector("span");

    const icon = toast.querySelector("i");

    text.innerText = message;

    toast.className = "toast";

    switch (type) {

        case "error":

            toast.style.background = "#DC2626";

            icon.className = "fa-solid fa-circle-xmark";

            break;

        case "warning":

            toast.style.background = "#F59E0B";

            icon.className = "fa-solid fa-triangle-exclamation";

            break;

        default:

            toast.style.background = "#16A34A";

            icon.className = "fa-solid fa-circle-check";

    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/*=========================================================
BUTTON LOADING STATE
=========================================================*/

function setButtonLoading(button, loading = true) {

    if (!button) return;

    if (loading) {

        button.dataset.originalText = button.innerHTML;

        button.disabled = true;

        button.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Processing...

        `;

    } else {

        button.disabled = false;

        button.innerHTML =

            button.dataset.originalText;

    }

}

/*=========================================================
CARD INTERACTIONS
=========================================================*/

function initializeInteractiveCards() {

    const cards = document.querySelectorAll(

        ".portfolio-card, .metric-card"

    );

    cards.forEach(card => {

        card.addEventListener("click", () => {

            card.animate(

                [

                    { transform: "scale(1)" },

                    { transform: "scale(.97)" },

                    { transform: "scale(1)" }

                ],

                {

                    duration: 250

                }

            );

        });

    });

}

/*=========================================================
SMOOTH SCROLL
=========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});

/*=========================================================
KEYBOARD SHORTCUTS
=========================================================*/

document.addEventListener("keydown",(e)=>{

    // ESC closes modal

    if(e.key==="Escape"){

        const modal=document.getElementById("projectModal");

        if(modal){

            modal.style.display="none";

            document.body.style.overflow="";

        }

    }

    // Ctrl + Shift + R

    if(e.ctrlKey && e.shiftKey && e.key==="R"){

        e.preventDefault();

        location.reload();

    }

});

/*=========================================================
ACCESSIBILITY
=========================================================*/

function initializeAccessibility(){

    document.querySelectorAll("button").forEach(btn=>{

        btn.setAttribute("tabindex","0");

    });

    document.querySelectorAll("select").forEach(select=>{

        select.setAttribute("aria-label",select.id);

    });

}

/*=========================================================
CARD COUNTER HIGHLIGHT
=========================================================*/

function highlightHighestMetric(){

    const metrics=document.querySelectorAll(".metric-card h2");

    let highest=0;

    let card=null;

    metrics.forEach(item=>{

        const value=parseFloat(

            item.innerText.replace(/[^\d.]/g,"")

        );

        if(value>highest){

            highest=value;

            card=item.closest(".metric-card");

        }

    });

    if(card){

        card.style.border="2px solid #2563EB";

    }

}

/*=========================================================
INITIALIZE PART 3
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initializeProjectModal();

    initializeInteractiveCards();

    initializeAccessibility();

    highlightHighestMetric();

});
/*=========================================================
TABLE SORTING
=========================================================*/

function initializeTableSorting() {

    const headers = document.querySelectorAll("table thead th");

    headers.forEach((header, index) => {

        header.style.cursor = "pointer";

        header.addEventListener("click", () => {

            sortTable(index);

        });

    });

}

function sortTable(columnIndex) {

    const table = document.querySelector("table");

    if (!table) return;

    const tbody = table.querySelector("tbody");

    const rows = Array.from(tbody.querySelectorAll("tr"));

    const ascending =
        table.dataset.sort !== "asc";

    rows.sort((a, b) => {

        const aText =
            a.children[columnIndex].innerText.trim();

        const bText =
            b.children[columnIndex].innerText.trim();

        const aNum = parseFloat(aText);

        const bNum = parseFloat(bText);

        if (!isNaN(aNum) && !isNaN(bNum)) {

            return ascending
                ? aNum - bNum
                : bNum - aNum;

        }

        return ascending
            ? aText.localeCompare(bText)
            : bText.localeCompare(aText);

    });

    rows.forEach(row => tbody.appendChild(row));

    table.dataset.sort =
        ascending ? "asc" : "desc";

}

/*=========================================================
AUTO REFRESH SIMULATION
=========================================================*/

function initializeAutoRefresh() {

    setInterval(() => {

        updateLastRefresh();

        console.log("Dashboard refreshed");

    }, 300000);

}

/*=========================================================
EXPORT TABLE TO CSV
=========================================================*/

function exportTableCSV(filename = "portfolio.csv") {

    const table = document.querySelector("table");

    if (!table) return;

    const rows = table.querySelectorAll("tr");

    const csv = [];

    rows.forEach(row => {

        const cols = row.querySelectorAll("th, td");

        const data = [];

        cols.forEach(col => {

            data.push(
                `"${col.innerText.replace(/"/g, '""')}"`
            );

        });

        csv.push(data.join(","));

    });

    const blob = new Blob([csv.join("\n")], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/*=========================================================
PRINT DASHBOARD
=========================================================*/

function printDashboard() {

    window.print();

}

/*=========================================================
KEYBOARD SHORTCUTS
=========================================================*/

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key.toLowerCase() === "e") {

        e.preventDefault();

        exportTableCSV();

        showToast("CSV exported");

    }

    if (e.ctrlKey && e.key.toLowerCase() === "p") {

        e.preventDefault();

        printDashboard();

    }

});

/*=========================================================
HELPERS
=========================================================*/

function formatNumber(value) {

    return new Intl.NumberFormat("en-IN")
        .format(value);

}

function debounce(fn, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            fn.apply(this, args);

        }, delay);

    };

}

/*=========================================================
WINDOW EVENTS
=========================================================*/

window.addEventListener("online", () => {

    showToast("Internet connection restored");

});

window.addEventListener("offline", () => {

    showToast(
        "You are offline",
        "warning"
    );

});

/*=========================================================
INITIALIZE FINAL MODULES
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeTableSorting();

    initializeAutoRefresh();

    console.log(
        "COE Portfolio Command Center Ready"
    );

});