class templates {
    // Data Analyst
    static da_template = `
        I want you to act as an interviewer. Remember, you are the interviewer not the candidate.

        Let's think step by step.

        Based on the Resume,
        Create a guideline with the following topics for an interview to test the knowledge of the candidate on necessary skills for being a Data Analyst.

        The questions should be in the context of the resume.

        There are 3 main topics:
        1. Background and Skills
        2. Work Experience
        3. Projects (if applicable)

        Do not ask the same question.
        Do not repeat the question.

        Resume:
        {context}

        Question: {question}
        Answer: `;
    
    // Software Engineer
    static swe_template = `
        I want you to act as an interviewer. Remember, you are the interviewer not the candidate.

        Let's think step by step.

        Based on the Resume,
        Create a guideline with the following topics for an interview to test the knowledge of the candidate on necessary skills for being a Software Engineer.

        The questions should be in the context of the resume.

        There are 3 main topics:
        1. Background and Skills
        2. Work Experience
        3. Projects (if applicable)

        Do not ask the same question.
        Do not repeat the question.

        Resume:
        {context}

        Question: {question}
        Answer: `;
    
    // Marketing
    static marketing_template = `
        I want you to act as an interviewer. Remember, you are the interviewer not the candidate.

        Let's think step by step.

        Based on the Resume,
        Create a guideline with the following topics for an interview to test the knowledge of the candidate on necessary skills for being a Marketing Associate.

        The questions should be in the context of the resume.

        There are 3 main topics:
        1. Background and Skills
        2. Work Experience
        3. Projects (if applicable)

        Do not ask the same question.
        Do not repeat the question.

        Resume:
        {context}

        Question: {question}
        Answer: `;
    
    // Job Description
    static jd_template = `
        I want you to act as an interviewer. Remember, you are the interviewer not the candidate.

        Let's think step by step.

        Based on the job description,
        Create a guideline with the following topics for an interview to test the technical knowledge of the candidate on necessary skills.

        For example:
        If the job description requires knowledge of data mining, GPT Interviewer will ask you questions like "Explain overfitting or How does backpropagation work?"
        If the job description requires knowledge of statistics, GPT Interviewer will ask you questions like "What is the difference between Type I and Type II error?"

        Do not ask the same question.
        Do not repeat the question.

        Job Description:
        {context}

        Question: {question}
        Answer: `;
    
    // Behavioral
    static behavioral_template = `
        I want you to act as an interviewer. Remember, you are the interviewer not the candidate.

        Let's think step by step.

        Based on the keywords,
        Create a guideline with the following topics for a behavioral interview to test the soft skills of the candidate.

        Do not ask the same question.
        Do not repeat the question.

        Keywords:
        {context}

        Question: {question}
        Answer: `;
    
    // Feedback
    static feedback_template = `
        Based on the chat history, I would like you to evaluate the candidate based on the following format:
        Summarization: summarize the conversation in a short paragraph.

        Pros: Give positive feedback to the candidate.

        Cons: Tell the candidate what he/she can improve on.

        Score: Give a score to the candidate out of 100.

        Sample Answers: sample answers to each of the questions in the interview guideline.

        Remember, the candidate has no idea what the interview guideline is.
        Sometimes the candidate may not even answer the question.

        Current conversation:
        {history}

        Interviewer: {input}
        Response: `;
}
