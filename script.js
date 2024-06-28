function toggleBodyTextarea() {
    const method = document.getElementById("method").value;
    const bodyTextarea = document.getElementById("body");
    if (method === "GET" || method === "DELETE") {
        bodyTextarea.disabled = true;
        bodyTextarea.value = '';
    } else {
        bodyTextarea.disabled = false;
    }
}

async function startTest() {
    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value;
    const body = document.getElementById("body").value;
    const numRequests = parseInt(document.getElementById("numRequests").value);
    const concurrent = parseInt(document.getElementById("concurrent").value);
    const logResults = document.getElementById("logResults").checked;
    const data = {
        "method": method,
        "url": url,
        "body": body,
        "req_count": numRequests,
        "c_req_count": concurrent
    };
    try {
        const response = await fetch('http://localhost:4044/test/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        document.getElementById("time").textContent = `Time taken: ${result.time} seconds`;
        document.getElementById("successful").textContent = `Successful requests: ${result.successful_requests}`;
        document.getElementById("failed").textContent = `Failed requests: ${result.failed_requests}`;

        if (logResults) {
            document.getElementById("logs").innerHTML += `${result.logs.replace(/\n/g, "<br>")}`;
        }
    } catch (error) {
        console.error('Error:', error);
        if (logResults) {
            document.getElementById("logs").textContent += `Error: ${error.message}\n`;
        }
    }
}

document.getElementById("body").disabled = true;
