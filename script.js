let formCount = 0;
let titleInterval;

function addNewForm() {
    if (formCount == 5) {
        return;
    }
    formCount++;
    const formContainer = document.getElementById('forms-container');
    const newForm = document.createElement('div');
    newForm.className = 'form-container';
    newForm.id = `form-${formCount}`;
    newForm.innerHTML = `
        <div class="form-header">
            <select id="method-${formCount}" onchange="toggleBodyTextarea(${formCount})">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
            </select>
            <button class="delete-btn" onclick="deleteForm(${formCount})">❌</button>
        </div>
        <label for="url-${formCount}">URL:</label>
        <input type="text" id="url-${formCount}" placeholder="https://example.com/api">

        <label for="body-${formCount}">Request Body:</label>
        <textarea id="body-${formCount}" placeholder='{"key": "value"}' disabled></textarea>

        <label for="numRequests-${formCount}">Number of Requests:</label>
        <input type="number" id="numRequests-${formCount}" value="1000">

        <label for="concurrent-${formCount}">Concurrent Requests:</label>
        <input type="number" id="concurrent-${formCount}" value="100">

        <div class="result">
            <h2>Results</h2>
            <p id="time-${formCount}"></p>
            <p id="successful-${formCount}"></p>
            <p id="failed-${formCount}"></p>
            <p id="response-${formCount}"></p>
        </div>
    `;
    formContainer.appendChild(newForm);
}

function deleteForm(formId) {
    if (formCount == 1) {
        return;
    }
    formCount--;

    const formToDelete = document.getElementById(`form-${formId}`);
    if (formToDelete) {
        formToDelete.remove();
    }
}

function toggleBodyTextarea(formId) {
    const method = document.getElementById(`method-${formId}`).value;
    const bodyTextarea = document.getElementById(`body-${formId}`);
    if (method === "GET" || method === "DELETE") {
        bodyTextarea.disabled = true;
        bodyTextarea.value = '';
    } else {
        bodyTextarea.disabled = false;
    }
}

function animateTitle() {
    const h1 = document.querySelector('h1');
    const phrases = ['Processing', 'Processing.', 'Processing..', 'Processing...'];
    let index = 0;

    document.body.classList.add('processing');

    function updateText() {
        h1.textContent = phrases[index];
        index = (index + 1) % phrases.length;
    }

    updateText();
    titleInterval = setInterval(updateText, 500); 
}

function resetTitle() {
    const h1 = document.querySelector('h1');
    clearInterval(titleInterval);
    h1.textContent = 'Testing Tool';
    document.body.classList.remove('processing');
}

async function startAllTests() {
    animateTitle();

    const logResults = document.getElementById("logResults").checked;
    const testsData = [];

    for (let i = 1; i <= formCount; i++) {
        const method = document.getElementById(`method-${i}`).value;
        const url = document.getElementById(`url-${i}`).value;
        const body = document.getElementById(`body-${i}`).value;
        const numRequests = parseInt(document.getElementById(`numRequests-${i}`).value);
        const concurrent = parseInt(document.getElementById(`concurrent-${i}`).value);

        testsData.push({
            "method": method,
            "url": url,
            "body": body,
            "req_count": numRequests,
            "c_req_count": concurrent
        });
    }

    try {
        const response = await fetch('http://localhost:4044/test/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testsData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }   

        const result = await response.json();

        testsData.forEach((_, index) => {
            document.getElementById(`time-${index + 1}`).textContent = `Time taken: ${result[index].time} seconds`;
            document.getElementById(`successful-${index + 1}`).textContent = `Successful requests: ${result[index].successful_requests}`;
            document.getElementById(`failed-${index + 1}`).textContent = `Failed requests: ${result[index].failed_requests}`;
        });

        if (logResults) {
            result.forEach(res => {
                document.getElementById("logs").innerHTML += `${res.logs.replace(/\n/g, "<br>")}`;
            });
            const logsPanel = document.getElementById('logs-panel');
            if (logsPanel.classList.contains('collapsed')) {
                toggleLogs();
            }
            const logsContent = document.querySelector('.logs-content');
            logsContent.scrollTop = logsContent.scrollHeight;
        }
    } catch (error) {
        console.error('Error:', error);
        if (logResults) {
            document.getElementById("logs").innerHTML += `Error: ${error.message}<br>`;
        }
    } finally {
        resetTitle();
    }
}

function toggleLogs() {
    const logsPanel = document.getElementById('logs-panel');
    logsPanel.classList.toggle('collapsed');
}

window.onload = addNewForm;


























// let formCount = 0;

// function addNewForm() {
//     if (formCount == 5){
//         return;
//     }
//     formCount++;
//     const formContainer = document.getElementById('forms-container');
//     const newForm = document.createElement('div');
//     newForm.className = 'form-container';
//     newForm.id = `form-${formCount}`;
//     newForm.innerHTML = `
//         <div class="form-header">
//             <select id="method-${formCount}" onchange="toggleBodyTextarea(${formCount})">
//                 <option value="GET">GET</option>
//                 <option value="POST">POST</option>
//                 <option value="PUT">PUT</option>
//                 <option value="DELETE">DELETE</option>
//             </select>
//             <button class="delete-btn" onclick="deleteForm(${formCount})">❌</button>
//         </div>
//         <label for="url-${formCount}">URL:</label>
//         <input type="text" id="url-${formCount}" placeholder="localhost:4044/test">

//         <label for="body-${formCount}">Request Body:</label>
//         <textarea id="body-${formCount}" placeholder='{"key": "value"}' disabled></textarea>

//         <label for="numRequests-${formCount}">Number of Requests:</label>
//         <input type="number" id="numRequests-${formCount}" value="1000">

//         <label for="concurrent-${formCount}">Concurrent Requests:</label>
//         <input type="number" id="concurrent-${formCount}" value="100">

//         <div class="result">
//             <h2>Results</h2>
//             <p id="time-${formCount}"></p>
//             <p id="successful-${formCount}"></p>
//             <p id="failed-${formCount}"></p>
//             <p id="response-${formCount}"></p>
//         </div>
//     `;
//     formContainer.appendChild(newForm);
// }

// function deleteForm(formId) {
//     if (formCount == 1){
//         return;
//     }
//     formCount--;

//     const formToDelete = document.getElementById(`form-${formId}`);
//     if (formToDelete) {
//         formToDelete.remove();
//     }
// }

// function toggleBodyTextarea(formId) {
//     const method = document.getElementById(`method-${formId}`).value;
//     const bodyTextarea = document.getElementById(`body-${formId}`);
//     if (method === "GET" || method === "DELETE") {
//         bodyTextarea.disabled = true;
//         bodyTextarea.value = '';
//     } else {
//         bodyTextarea.disabled = false;
//     }
// }

// async function startAllTests() {
//     const logResults = document.getElementById("logResults").checked;
//     for (let i = 1; i <= formCount; i++) {
//         await startTest(i, logResults);
//     }
// }

// async function startTest(formId, logResults) {
//     const method = document.getElementById(`method-${formId}`).value;
//     const url = document.getElementById(`url-${formId}`).value;
//     const body = document.getElementById(`body-${formId}`).value;
//     const numRequests = parseInt(document.getElementById(`numRequests-${formId}`).value);
//     const concurrent = parseInt(document.getElementById(`concurrent-${formId}`).value);
//     const data = {
//         "method": method,
//         "url": url,
//         "body": body,
//         "req_count": numRequests,
//         "c_req_count": concurrent
//     };
//     try {
//         const response = await fetch('http://localhost:4044/test/post', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();

//         document.getElementById(`time-${formId}`).textContent = `Time taken: ${result.time} seconds`;
//         document.getElementById(`successful-${formId}`).textContent = `Successful requests: ${result.successful_requests}`;
//         document.getElementById(`failed-${formId}`).textContent = `Failed requests: ${result.failed_requests}`;

//         if (logResults) {
//             document.getElementById("logs").innerHTML += `${result.logs.replace(/\n/g, "<br>")}`;
//             const logsPanel = document.getElementById('logs-panel');
//             if (logsPanel.classList.contains('collapsed')) {
//                 toggleLogs();
//             }
//             const logsContent = document.querySelector('.logs-content');
//             logsContent.scrollTop = logsContent.scrollHeight;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         if (logResults) {
//             document.getElementById("logs").innerHTML += `Error: ${error.message}<br>`;
//         }
//     }
// }

// function toggleLogs() {
//     const logsPanel = document.getElementById('logs-panel');
//     logsPanel.classList.toggle('collapsed');
// }

// window.onload = addNewForm;






