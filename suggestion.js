// Scenario 1: exhibitors: multiple files and sponsors: multiple files
// Frontend Implementation:
// The developer can use a FormData object to append multiple files under the same key(exhibitors and sponsors).


// const formData = new FormData();

// Assuming `exhibitorFiles` and `sponsorFiles` are arrays of File objects
exhibitorFiles.forEach((file) => {
    formData.append("exhibitors", file); // All files under the key "exhibitors"
});

sponsorFiles.forEach((file) => {
    formData.append("sponsors", file); // All files under the key "sponsors"
});

// Sending the data via an HTTP request (e.g., using Axios)
axios.post("/upload", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
// In this scenario:

// All files are grouped under exhibitors and sponsors respectively.
// The backend processes them as arrays under these keys, e.g., req.files['exhibitors'].
//     Scenario 2: exhibitors[0]: file, exhibitors[1]: file
// Frontend Implementation:
// The developer can use a FormData object, but this time they explicitly use indexed keys like exhibitors[0], exhibitors[1], etc.

//     javascript
// Copy code

// const formData = new FormData();

// Assuming `exhibitorFiles` and `sponsorFiles` are arrays of File objects
exhibitorFiles.forEach((file, index) => {
    formData.append(`exhibitors[${index}]`, file); // Use indexed keys
});

sponsorFiles.forEach((file, index) => {
    formData.append(`sponsors[${index}]`, file); // Use indexed keys
});

// Sending the data via an HTTP request (e.g., using Axios)
axios.post("/upload", formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));




// In this scenario:

// Files are sent individually under exhibitors[0], exhibitors[1], and so on.
// The backend must explicitly handle this nested structure, e.g., parsing the keys to group them under exhibitors.
// Summary of Differences in Frontend Implementation:
// Aspect	exhibitors: multiple files	exhibitors[0]: file, exhibitors[1]: file
// FormData Key	Same key(exhibitors, sponsors) for all files	Unique indexed keys(exhibitors[0], exhibitors[1])
// Loop Implementation	formData.append("exhibitors", file)	formData.append(\exhibitors[${ index }]`, file)`
// Backend Handling	Simpler, uses multer.fields or multer.array	More complex, requires parsing indexed keys
// Recommendation for Frontend and Backend Coordination:
// Prefer the simpler exhibitors: multiple files approach unless there's a specific requirement for indexed keys.
// It ensures compatibility with standard file upload libraries(e.g., multer) and minimizes the need for additional parsing logic on the backend.
// Would you like examples for React or another framework ?