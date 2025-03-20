import React from 'react';
import Holidays from '../component/Holidays/Holidays';

const page = () => {

    const holidays = [
        {
            "title": "New Year",
            "date": "01 Jan 2025",
            "description": "First day of the new year",
            "status": "Active"
        },
        {
            "title": "Martin Luther King Jr. Day",
            "date": "20 Jan 2025",
            "description": "Celebrating the civil rights leader",
            "status": "Active"
        },
        {
            "title": "President’s Day",
            "date": "17 Feb 2025",
            "description": "Honoring past US Presidents",
            "status": "Active"
        },
        {
            "title": "Good Friday",
            "date": "18 Apr 2025",
            "description": "Holiday before Easter",
            "status": "Active"
        },
        {
            "title": "Easter Monday",
            "date": "21 Apr 2025",
            "description": "Holiday after Easter",
            "status": "Active"
        },
        {
            "title": "Memorial Day",
            "date": "26 May 2025",
            "description": "Honors military personnel",
            "status": "Active"
        },
        {
            "title": "Independence Day",
            "date": "04 Jul 2025",
            "description": "Celebrates Independence",
            "status": "Active"
        },
        {
            "title": "Labour Day",
            "date": "01 Sep 2025",
            "description": "Honors working people",
            "status": "Inactive"
        },
        {
            "title": "Veterans Day",
            "date": "11 Nov 2025",
            "description": "Honors military veterans",
            "status": "Active"
        }
    ]


    return (
        <div>
            <Holidays holidays={holidays} />
        </div>
    );
};

export default page;