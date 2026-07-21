import fetch from "node-fetch";

async function test() {
    try {
        const response = await fetch("http://localhost:5000/api/coach", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer bypass"
            },
            body: JSON.stringify({
                message: "What is the best way to prepare for a technical interview?"
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();

