// Native fetch in Node 18+

const runTest = async () => {
    const payload = {
        recipients: [{ email: "test@example.com", "name": "Test Student" }],
        quizDetails: {
            title: "Test Activity",
            subject: "Test Subject",
            branch: "CSE",
            year: "3",
            semester: "5",
            publishDate: "08 Feb 2026",
            facultyName: "Dr. Smith"
        },
        // No custom subject/message to force default template
    };

    try {
        const response = await fetch('http://localhost:3001/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("Result:", JSON.stringify(result, null, 2));

        // In a real scenario, we'd check the logs or mocked email output.
        // Since server.js logs "SMTP SENT" or similar, we should check server output if possible.
        // For now, success response is a good sign.
    } catch (error) {
        console.error("Test Failed:", error);
    }
};

runTest();
