export const BOT_RESPONSES: Record<string, string> = {
    "hello|hi|hey|greetings|welcome": 
        `Hello! I am your HRD ROOM AI Assistant. How can I help you manage your classroom, students, or performance reports today?`,
    
    "thank you|thanks": 
        `You're very welcome! Let me know if you need any more insights or reports.`,

    "fail|failing|risk|drop|alert": 
        `Based on current performance trends, 3 students are currently flagged at risk of failing due to incomplete database assignments and quiz averages dropping below 60%.`,

    "late|lateness|absent|attendance|miss": 
        `John Doe and Jane Smith have the highest frequency of late submissions this semester, averaging 3 days past the baseline deadline. Attendance is otherwise steady at 92%.`,

    "score|grade|quiz|exam|average|lowest": 
        `The tasks with the lowest average scores are Database Normalization Assignment with an average score of 58%, followed by System Design Case Study at 61%, and Algorithm Complexity Quiz at 64%.`,

    "help|features|info": 
        `I can give you rapid reports on student analytics! You can ask me about:
• Failing risk alerts ("Which students are failing?")
• Lateness tracking ("Who is late with assignments?")
• Score trends ("What are the lowest averages?")`
};

export const DEFAULT_FALLBACK_REPLY = `I'm analyzing that query for you now. Could you please specify if you want to check student scores, failing risks, lateness trends, or upcoming deadlines?`;