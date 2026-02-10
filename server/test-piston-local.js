// server/test-piston-local.js
// Tests the local /api/compile endpoint

async function runLocalJava() {
    const code = `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello from Local Piston Proxy");
        }
    }`;

    console.log("Sending code to Local Server...");

    try {
        const response = await fetch("http://localhost:3001/api/compile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: code,
                language: "java"
            })
        });

        const data = await response.json();
        console.log("Local Server Response:", JSON.stringify(data, null, 2));

        if (data.output && data.output.includes("Hello from Local Piston Proxy")) {
            console.log("✅ SUCCESS: Local Piston integration works.");
        } else if (data.error) {
            console.log("❌ FAILURE: Server Error - " + data.error);
        } else {
            console.log("❌ FAILURE: Unexpected output.");
        }

    } catch (error) {
        console.error("Error calling Local Server:", error);
    }
}

runLocalJava();
