const projectForm = document.getElementById("projectForm");

const progressSlider = document.getElementById("progress");

const progressText = document.getElementById("progressText");

let formChanged = false;

document.addEventListener("DOMContentLoaded", () => {

    initializeForm();

});

function initializeForm() {

    initializeProgress();

    initializeValidation();

    initializeDateValidation();

    initializeChangeTracking();

    initializeSubmit();

}

function initializeProgress() {

    if (!progressSlider) return;

    progressText.innerText = progressSlider.value + "%";

    progressSlider.addEventListener("input", function () {

        progressText.innerText = this.value + "%";

        const percentage = this.value;

        this.style.background =

            `linear-gradient(
                to right,
                #2563EB 0%,
                #2563EB ${percentage}%,
                #E2E8F0 ${percentage}%,
                #E2E8F0 100%
            )`;

    });

}

function initializeValidation() {

    const requiredFields =

        projectForm.querySelectorAll(

            "input[required], select[required]"

        );

    requiredFields.forEach(field => {

        field.addEventListener("blur", () => {

            validateField(field);

        });

        field.addEventListener("input", () => {

            if (field.classList.contains("error")) {

                validateField(field);

            }

        });

    });

}

function validateField(field) {

    const value = field.value.trim();

    removeValidation(field);

    if (value === "") {

        field.classList.add("error");

        showFieldError(

            field,

            "This field is required."

        );

        return false;

    }

    field.classList.add("success");

    return true;

}

function showFieldError(field, message) {

    let error =

        field.parentElement.querySelector(

            ".error-message"

        );

    if (!error) {

        error = document.createElement("div");

        error.className = "error-message";

        field.parentElement.appendChild(error);

    }

    error.innerText = message;

    error.classList.add("show");

}

function removeValidation(field) {

    field.classList.remove(

        "error",

        "success"

    );

    const error =

        field.parentElement.querySelector(

            ".error-message"

        );

    if (error) {

        error.remove();

    }

}

function initializeDateValidation() {

    const start =

        document.getElementById("startDate");

    const end =

        document.getElementById("endDate");

    if (!start || !end) return;

    function checkDates() {

        if (

            start.value &&
            end.value &&
            end.value < start.value

        ) {

            end.classList.add("error");

            showFieldError(

                end,

                "End date must be after start date."

            );

        } else {

            removeValidation(end);

        }

    }

    start.addEventListener("change", checkDates);

    end.addEventListener("change", checkDates);

}

function initializeChangeTracking() {

    projectForm

        .querySelectorAll(

            "input, select, textarea"

        )

        .forEach(control => {

            control.addEventListener("change", () => {

                formChanged = true;

            });

        });

}

function initializeSubmit() {

    projectForm.addEventListener(

        "submit",

        function (e) {

            e.preventDefault();

            let valid = true;

            const required =

                projectForm.querySelectorAll(

                    "input[required], select[required]"

                );

            required.forEach(field => {

                if (

                    !validateField(field)

                ) {

                    valid = false;

                }

            });

            if (!valid) {

                showNotification(

                    "Please complete all required fields.",

                    "error"

                );

                return;

            }

            submitProject();

        }

    );

}

function submitProject() {

    const submitButton =

        projectForm.querySelector(

            'button[type="submit"]'

        );

    submitButton.disabled = true;

    submitButton.innerHTML =

        '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    setTimeout(() => {

        submitButton.disabled = false;

        submitButton.innerHTML =

            '<i class="fa-solid fa-paper-plane"></i> Submit Project';

        formChanged = false;

        showNotification(

            "Project created successfully.",

            "success"

        );

    }, 1800);

}

const STORAGE_KEY = "coe_project_draft";

function initializeDraft() {

    loadDraft();

    const saveDraftBtn = document.getElementById("saveDraft");

    if (!saveDraftBtn) return;

    saveDraftBtn.addEventListener("click", saveDraft);

}

function saveDraft() {

    const data = {};

    const controls = projectForm.querySelectorAll(

        "input, select, textarea"

    );

    controls.forEach(control => {

        if (control.type === "file") return;

        data[control.id] = control.value;

    });

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

    formChanged = false;

    showNotification(

        "Draft saved successfully.",

        "success"

    );

}

function loadDraft() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {

        const data = JSON.parse(saved);

        Object.keys(data).forEach(key => {

            const field = document.getElementById(key);

            if (!field) return;

            field.value = data[key];

        });

        if (progressSlider && progressText) {

            progressText.textContent =

                progressSlider.value + "%";

        }

    }

    catch(error){

        console.error(error);

    }

}

function clearDraft(){

    localStorage.removeItem(STORAGE_KEY);

}

function initializeReset(){

    projectForm.addEventListener("reset",function(e){

        const ok = confirm(

            "Reset the form and remove all entered information?"

        );

        if(!ok){

            e.preventDefault();

            return;

        }

        clearDraft();

        setTimeout(()=>{

            if(progressSlider){

                progressSlider.value=25;

                progressText.textContent="25%";

            }

        },50);

        showNotification(

            "Form has been reset.",

            "success"

        );

    });

}

window.addEventListener("beforeunload",function(e){

    if(!formChanged){

        return;

    }

    e.preventDefault();

    e.returnValue="";

});

function showNotification(message,type="success"){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        toast.className="toast";

        document.body.appendChild(toast);

    }

    let icon="fa-circle-check";

    let background="#16A34A";

    if(type==="error"){

        icon="fa-circle-xmark";

        background="#DC2626";

    }

    if(type==="warning"){

        icon="fa-triangle-exclamation";

        background="#F59E0B";

    }

    toast.style.background=background;

    toast.innerHTML=`

        <i class="fa-solid ${icon}"></i>

        <span>${message}</span>

    `;

    toast.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout=setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

document.addEventListener("DOMContentLoaded",()=>{

    initializeDraft();

    initializeReset();

});

let uploadedFiles = [];

function initializeFileUpload() {

    const dropZone = document.getElementById("dropZone");

    const fileInput = document.getElementById("projectFiles");

    const browseButton = document.getElementById("browseFiles");

    if (!dropZone || !fileInput || !browseButton) return;

    browseButton.addEventListener("click", () => {

        fileInput.click();

    });

    fileInput.addEventListener("change", (e) => {

        handleFiles(e.target.files);

    });

    dropZone.addEventListener("dragenter", preventDefaults);

    dropZone.addEventListener("dragover", preventDefaults);

    dropZone.addEventListener("dragleave", removeDrag);

    dropZone.addEventListener("drop", dropHandler);

}

function preventDefaults(e) {

    e.preventDefault();

    e.stopPropagation();

    document

        .getElementById("dropZone")

        .classList.add("dragover");

}

function removeDrag(e) {

    e.preventDefault();

    e.stopPropagation();

    document

        .getElementById("dropZone")

        .classList.remove("dragover");

}

function dropHandler(e) {

    removeDrag(e);

    const files = e.dataTransfer.files;

    handleFiles(files);

}

function handleFiles(files) {

    Array.from(files).forEach(file => {

        if (validateFile(file)) {

            uploadedFiles.push(file);

        }

    });

    renderFiles();

}

function validateFile(file) {

    const allowedTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "image/png",

        "image/jpeg"

    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {

        showNotification(

            `${file.name} is not a supported file.`,

            "error"

        );

        return false;

    }

    if (file.size > maxSize) {

        showNotification(

            `${file.name} exceeds 10 MB.`,

            "error"

        );

        return false;

    }

    return true;

}

function renderFiles() {

    const list = document.getElementById("fileList");

    if (!list) return;

    list.innerHTML = "";

    uploadedFiles.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `

            <div class="file-info">

                <i class="${getFileIcon(file)}"></i>

                <div>

                    <div class="file-name">

                        ${file.name}

                    </div>

                    <div class="file-size">

                        ${formatFileSize(file.size)}

                    </div>

                </div>

            </div>

            <button
                type="button"
                class="remove-file"
                data-index="${index}">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;

        list.appendChild(item);

    });

    initializeRemoveButtons();

}

function initializeRemoveButtons() {

    document

        .querySelectorAll(".remove-file")

        .forEach(button => {

            button.onclick = function () {

                const index = Number(

                    this.dataset.index

                );

                uploadedFiles.splice(index, 1);

                renderFiles();

                showNotification(

                    "File removed.",

                    "warning"

                );

            };

        });

}

function getFileIcon(file) {

    const name = file.name.toLowerCase();

    if (name.endsWith(".pdf"))

        return "fa-solid fa-file-pdf";

    if (

        name.endsWith(".doc") ||

        name.endsWith(".docx")

    )

        return "fa-solid fa-file-word";

    if (

        name.endsWith(".xls") ||

        name.endsWith(".xlsx")

    )

        return "fa-solid fa-file-excel";

    if (

        name.endsWith(".png") ||

        name.endsWith(".jpg") ||

        name.endsWith(".jpeg")

    )

        return "fa-solid fa-file-image";

    return "fa-solid fa-file";

}

function formatFileSize(bytes) {

    if (bytes < 1024)

        return bytes + " Bytes";

    if (bytes < 1024 * 1024)

        return (

            (bytes / 1024).toFixed(1) +

            " KB"

        );

    return (

        (bytes / (1024 * 1024)).toFixed(2) +

        " MB"

    );

}

document.addEventListener("DOMContentLoaded", () => {

    initializeFileUpload();

});

function initializeKeyboardShortcuts() {

    document.addEventListener("keydown", function (e) {

       
        if (e.ctrlKey && e.key.toLowerCase() === "s") {

            e.preventDefault();

            saveDraft();

        }

       
        if (e.key === "Escape") {

            const confirmReset = confirm(
                "Do you want to reset the form?"
            );

            if (confirmReset) {

                projectForm.reset();

                uploadedFiles = [];

                renderFiles();

                progressSlider.value = 25;
                progressText.textContent = "25%";

            }

        }

    });

}

/*=========================================================
AUTO SAVE
=========================================================*/

function initializeAutoSave() {

    setInterval(() => {

        if (formChanged) {

            saveDraft();

            console.log("Draft auto-saved");

        }

    }, 60000);

}

/*=========================================================
SUCCESS DIALOG
=========================================================*/

function showSuccessDialog() {

    const overlay = document.createElement("div");

    overlay.className = "success-overlay";

    overlay.innerHTML = `

        <div class="success-dialog">

            <div class="success-icon">

                <i class="fa-solid fa-circle-check"></i>

            </div>

            <h2>Project Created Successfully</h2>

            <p>

                Your project has been added to the
                COE Portfolio Command Center.

            </p>

            <button
                class="btn btn-primary"
                id="goDashboard">

                Go to Dashboard

            </button>

        </div>

    `;

    document.body.appendChild(overlay);

    document
        .getElementById("goDashboard")
        .addEventListener("click", () => {

            clearDraft();

            window.location.href = "index.html";

        });

}

/*=========================================================
OVERRIDE SUBMIT
=========================================================*/

function submitProject() {

    const button = projectForm.querySelector(
        'button[type="submit"]'
    );

    button.disabled = true;

    button.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Saving Project...

    `;

    setTimeout(() => {

        clearDraft();

        formChanged = false;

        button.disabled = false;

        button.innerHTML = `

            <i class="fa-solid fa-paper-plane"></i>

            Submit Project

        `;

        showSuccessDialog();

    }, 1800);

}

/*=========================================================
HELPER FUNCTIONS
=========================================================*/

function generateProjectID() {

    const random = Math.floor(

        1000 + Math.random() * 9000

    );

    return "DE-" + random;

}

function initializeProjectID() {

    const idField =
        document.getElementById("projectId");

    if (!idField) return;

    if (idField.value === "") {

        idField.value = generateProjectID();

    }

}

function capitalizeWords(text) {

    return text.replace(/\b\w/g, function (char) {

        return char.toUpperCase();

    });

}

/*=========================================================
AUTO CAPITALIZE
=========================================================*/

function initializeCapitalization() {

    const fields = [

        "projectName",

        "projectManager",

        "businessOwner",

        "technology",

        "vendor"

    ];

    fields.forEach(id => {

        const input =
            document.getElementById(id);

        if (!input) return;

        input.addEventListener("blur", () => {

            input.value = capitalizeWords(
                input.value.trim()
            );

        });

    });

}

/*=========================================================
FINAL INITIALIZATION
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeProjectID();

    initializeKeyboardShortcuts();

    initializeAutoSave();

    initializeCapitalization();

    console.log(
        "Add Project Module Loaded Successfully"
    );

});
