import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useActivity } from '@/hooks/useActivities'; // Ensure this hook is exported
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';

const QuestionPaper = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const { data: activity, isLoading, error } = useActivity(activityId!);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-destructive">Failed to load activity.</p>
                <Button variant="outline" onClick={() => window.close()}>Close</Button>
            </div>
        );
    }

    // Helper to group questions by type
    const groupedQuestions: Record<string, any[]> = {};
    activity.questions.forEach(q => {
        const type = q.question_type;
        if (!groupedQuestions[type]) groupedQuestions[type] = [];
        groupedQuestions[type].push(q);
    });

    const questionTypeLabels: Record<string, string> = {
        mcq: "Multiple Choice Questions",
        code_completion: "Code Completion",
        fill_blanks: "Fill in the Blanks",
        short_answer: "Short Answer",
        file_upload: "File Upload / Practical",
        paragraph: "Theory / Paragraph",
        checkbox: "Multiple Select",
        dropdown: "Select Correct Option",
        numerical: "Numerical / Calculation",
        output_prediction: "Output Prediction"
    };

    // Convert to array for rendering "Part A", "Part B"...
    const sections = Object.keys(groupedQuestions).map((type, index) => ({
        title: `PART ${String.fromCharCode(65 + index)} – ${questionTypeLabels[type] || 'Questions'}`,
        questions: groupedQuestions[type],
        totalMarks: groupedQuestions[type].reduce((sum, q) => sum + (q.marks || 0), 0)
    }));


    return (
        <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0 print:m-0 font-sans text-black">
            {/* Floating Actions (Hidden in Print) */}
            <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
                <Button onClick={handlePrint} className="gap-2 shadow-lg">
                    <Printer className="h-4 w-4" />
                    Print / Save as PDF
                </Button>
            </div>

            {/* A4 Container */}
            <div
                ref={printRef}
                className="mx-auto max-w-[210mm] min-h-[297mm] bg-white shadow-xl p-[20mm] print:shadow-none print:max-w-none print:p-0 print:mx-0 mb-8"
            >
                {/* 1. Header */}
                <div className="border-b-2 border-black pb-4 mb-6 text-center">
                    <h1 className="text-3xl font-serif font-bold uppercase mb-1 tracking-wide">
                        ORIGIN TRIVIA
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-widest text-gray-600 mb-4">
                        Activity-Based Learning Platform
                    </p>

                    <div className="mt-8 text-left space-y-2">
                        <div className="flex gap-2">
                            <span className="font-bold text-lg min-w-[140px]">Activity Name:</span>
                            <span className="text-lg border-b border-black border-dashed flex-1">{activity.title}</span>
                        </div>
                        {activity.description && (
                            <div className="flex gap-2">
                                <span className="font-bold text-lg min-w-[140px]">Description:</span>
                                <span className="text-lg italic border-b border-black border-dashed flex-1">{activity.description}</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <span className="font-bold text-lg min-w-[140px]">Activity Type:</span>
                            <span className="text-lg border-b border-black border-dashed flex-1 capitalize">{activity.activity_type.replace('_', ' ')} Activity</span>
                        </div>
                    </div>
                </div>

                {/* 2. Class Information Box */}
                <div className="border border-black rounded-lg p-4 mb-8">
                    <h3 className="font-bold uppercase mb-4 text-sm border-b border-gray-300 pb-1 w-max">Class Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">

                        {/* Row 1 */}
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Subject:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2 font-semibold">
                                {activity.subjects?.name || 'N/A'}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Branch:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2">
                                {activity.target_branch || 'All'}
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Year:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2">
                                {activity.target_year || 'All'}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Semester:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2">
                                {activity.target_semester || 'All'}
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Given Date:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2">
                                {activity.created_at ? format(new Date(activity.created_at), 'dd MMM yyyy') : 'N/A'}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="w-24 font-medium shrink-0">Deadline:</span>
                            <div className="flex-1 border-b border-black border-dashed px-2">
                                {activity.deadline ? format(new Date(activity.deadline), 'dd MMM yyyy') : 'No Deadline'}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Instructions */}
                <div className="mb-8">
                    <h3 className="font-bold uppercase text-lg mb-2">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
                        <li>Read all questions carefully before answering.</li>
                        <li>Write your answers clearly in the provided space or on a separate sheet if necessary.</li>
                        <li>All questions are compulsory unless specified otherwise.</li>
                        <li>Use of mobile phones or unauthorized materials is strictly prohibited.</li>
                        {activity.instructions && (
                            <li className="font-medium text-black mt-2 pt-2 border-t border-gray-200">{activity.instructions}</li>
                        )}
                    </ol>
                </div>

                {/* 4. Questions */}
                <div className="space-y-8">
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} className="break-inside-avoid">
                            {/* Section Header */}
                            <div className="flex justify-between items-center border-b border-black pb-1 mb-4">
                                <h3 className="font-bold text-lg uppercase">{section.title}</h3>
                                <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded">[{section.totalMarks} Marks]</span>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-6">
                                {section.questions.map((q, qIdx) => (
                                    <div key={q.id} className="break-inside-avoid">
                                        <div className="flex gap-4">
                                            <span className="font-bold text-lg min-w-[24px]">{qIdx + 1}.</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-medium text-base whitespace-pre-wrap">{q.question_text}</p>
                                                    <span className="text-xs font-semibold text-gray-500 ml-2 whitespace-nowrap">({q.marks} m)</span>
                                                </div>

                                                {/* Code Template */}
                                                {(q.question_type === 'code_completion' || q.question_type === 'output_prediction' || q.code_template) && (
                                                    <div className="bg-gray-50 border border-gray-300 rounded p-4 my-2 font-mono text-sm whitespace-pre-wrap break-all relative">
                                                        {/* Line numbers logic could be complex, simple render for now */}
                                                        {q.code_template || q.faulty_code || "// No code provided"}
                                                    </div>
                                                )}

                                                {/* Options for MCQ */}
                                                {q.question_type === 'mcq' && q.question_options && (
                                                    <div className="grid grid-cols-2 gap-2 mt-2 ml-1">
                                                        {q.question_options.map((opt: any, oIdx: number) => (
                                                            <div key={oIdx} className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                                                                    {String.fromCharCode(97 + oIdx)}
                                                                </div>
                                                                <span className="text-sm">{opt.option_text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Space for answer (for printable worksheet feel) */}
                                                {(!['mcq', 'checkbox', 'dropdown'].includes(q.question_type)) && (
                                                    <div className="mt-4 border-b border-gray-300 border-dashed h-16 w-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 6. Marks Distribution Table */}
                <div className="mt-12 break-inside-avoid">
                    <h3 className="font-bold uppercase mb-2 text-sm">Marks Distribution</h3>
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-2 text-left">Section</th>
                                <th className="border border-black p-2 text-left">Description</th>
                                <th className="border border-black p-2 text-center w-24">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((section, idx) => (
                                <tr key={idx}>
                                    <td className="border border-black p-2 font-medium">PART {String.fromCharCode(65 + idx)}</td>
                                    <td className="border border-black p-2">{section.title.split('–')[1]?.trim() || 'Questions'}</td>
                                    <td className="border border-black p-2 text-center">{section.totalMarks}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-50">
                                <td className="border border-black p-2 text-right" colSpan={2}>TOTAL</td>
                                <td className="border border-black p-2 text-center">{activity.total_marks}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 7. Footer */}
                <div className="mt-16 pt-8 border-t border-black flex justify-between items-end break-inside-avoid">
                    <div className="text-center">
                        <div className="w-48 border-b border-black mb-2"></div>
                        <p className="text-xs uppercase font-medium">Instructor Signature</p>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                        <p>Generated on {format(new Date(), 'PPP')}</p>
                        <p>Page 1 of 1</p> {/* Simplified page number */}
                    </div>
                </div>

            </div>

            <div className="text-center print:hidden text-gray-500 text-sm pb-8">
                Tip: Settings under "More settings" in Print dialog &gt; check "Background graphics" for best result.
            </div>
        </div>
    );
};

export default QuestionPaper;
