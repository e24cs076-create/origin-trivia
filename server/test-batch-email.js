import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("--- Batch Email Test Script ---");

// Mock Data
const recipients = [
    { email: "test1@example.com", name: "Test User 1" },
    { email: "test2@example.com", name: "Test User 2" },
    { email: "test3@example.com", name: "Test User 3" }
];

const subject = "Batch Test: {{quiz_title}}";
const body = "Hello {{student_name}}, New activity: {{Activity_Name}}";

const quizDetails = {
    title: "Batch Logic Check",
    subject: "Debugging",
    branch: "CSE",
    year: "4",
    semester: "7",
    link: "http://localhost:5173",
    publishedDate: "2023-10-27",
    deadline: "No Deadline",
    facultyName: "Tester"
};

async function testBatchLogic() {
    console.log(`Simulating sending to ${recipients.length} recipients...`);

    // 1. GAS Batch Test
    if (process.env.GOOGLE_APPS_SCRIPT_URL) {
        console.log("\n[GAS] Testing Batch Request...");
        try {
            // Prepare batch payload for GAS
            // GAS Script expects: { recipients: [], subject, body }
            // and iterates inside.
            // We need to verify if the deployed GAS script supports this structure.
            // Based on 'GoogleAppsScript.txt' seen earlier, it DOES loop over recipients.

            const payload = {
                recipients: recipients,
                subject: subject.replace('{{quiz_title}}', quizDetails.title),
                body: body // Note: personalization {{student_name}} needs to happen IN GAS if we send one body.
                // OR we verify if GAS script does replacement.
                // Looking at GoogleAppsScript.txt: 
                // Yes, it does: emailBody = emailBody.replace('{{student_name}}', student.name);
            };

            const res = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const text = await res.text();
            console.log("GAS Response:", text);
        } catch (e) {
            console.error("GAS Helper Error:", e);
        }
    } else {
        console.log("[GAS] Skipped (No URL)");
    }

    // 2. SMTP Batch Test (Mock)
    console.log("\n[SMTP] Testing Concurrency Logic (Mock)...");
    const results = [];

    // Split into chunks of 5
    const chunkSize = 5;
    for (let i = 0; i < recipients.length; i += chunkSize) {
        const chunk = recipients.slice(i, i + chunkSize);
        console.log(`Processing chunk ${i / chunkSize + 1} (Size: ${chunk.length})...`);

        const promises = chunk.map(async (student) => {
            // Simulate SMTP delay
            await new Promise(r => setTimeout(r, 500));
            console.log(`  [SMTP] Sent to ${student.email}`);
            return { email: student.email, status: 'sent' };
        });

        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);
    }

    console.log(`\nprocessed ${results.length} emails.`);
}

testBatchLogic();
