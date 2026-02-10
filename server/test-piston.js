// server/test-piston.js
// No require, use global fetch (Node 18+)

async function runJava() {
    const code = `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello Piston from Test Script");
        }
    }`;

    console.log("Sending code to Piston...");

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: "java",
                version: "15.0.2",
                files: [
                    {
                        name: "Main.java",
                        content: code
                    }
                ]
            })
        });

        const data = await response.json();
        console.log("Piston Response:", JSON.stringify(data, null, 2));

        if (data.run && data.run.stdout && data.run.stdout.includes("Hello Piston")) {
            console.log("✅ SUCCESS: Code executed successfully.");
        } else if (data.message) {
            console.log("❌ FAILURE: API Error - " + data.message);
        } else {
            console.log("❌ FAILURE: Unexpected output.");
        }

    } catch (error) {
        console.error("Error calling Piston:", error);
    }
}

runJava();
