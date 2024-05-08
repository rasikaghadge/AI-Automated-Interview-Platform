
export const parseTimeString = (timeString: string, startDate: string | Date) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date(startDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return date;
  };