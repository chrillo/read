

export const getUtcOffsetForTimezoneInMinutes = (timeZone:string)=>{
   
    const dateText = Intl.DateTimeFormat([], {timeZone,timeZoneName:'short'}).format(new Date);
    
    // Scraping the numbers we want from the text
    const timezoneString = dateText.split(" ")[1].slice(3);

    // Getting the offset
    let timezoneOffset = parseInt(timezoneString.split(':')[0])*60;

    // Checking for a minutes offset and adding if appropriate
    if (timezoneString.includes(":")) {
        timezoneOffset = timezoneOffset + parseInt(timezoneString.split(':')[1]);
    }
    return timezoneOffset
}