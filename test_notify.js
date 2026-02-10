// using native fetch

async function testNotify() {
    console.log("Testing /api/notify endpoint...");
    try {
        const response = await fetch('http://localhost:3001/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipients: [{ email: 'test@example.com', name: 'Test Student', id: 'test-id' }],
                quizDetails: {
                    title: 'Test Activity',
                    subject: 'Test Subject',
                    branch: 'CSE',
                    year: '3',
                    semester: '5',
                    link: 'http://localhost:5173/student/activity/test-id',
                    publishDate: '09 Feb 2026',
                    deadline: 'No Deadline',
                    facultyName: 'Test Faculty'
                },
                customSubject: 'Test Notification',
                customMessage: 'This is a test message.'
            })
        });

        const result = await response.json();
        console.log("Response:", result);
    } catch (error) {
        console.error("Error testing notify:", error);
    }
}

testNotify();
