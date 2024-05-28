import axios from "axios";

export const sendInterviewStatusEmail = async (interview: any): Promise<void> => {
    const data = {
          mail_type: "schedule_interview",
          hr: {
            email: interview.hr.email,
            firstName: interview.hr.firstName,
            lastName: interview.hr.lastName,
            company: interview.title 
          },
          candidate: {
            email: interview.candidate.email,
            firstName: interview.candidate.firstName,
            lastName: interview.candidate.lastName,
          },
          title: interview.title,
          startDate: interview.startDate,
          startTime: interview.startTime,
          endTime: interview.endTime
        };

  try {
    const config: any = {
      method: 'post',
      url: 'http://127.0.0.1:8001/mail/', // TODO: change here get it from .env
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    };


    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
};