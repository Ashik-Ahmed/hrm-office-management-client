'use client'
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import React, { useState } from 'react';

const page = () => {
    const [selectedANSTypes, setSelectedANSTypes] = useState(null)
    const [selectedANSs, setSelectedANSs] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const countryTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.name}</div>
            </div>
        );
    };

    const panelFooterTemplate = () => {
        const length = selectedANSs ? selectedANSs.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };

    const handleFormSubmit = (e) => {
        e.preventDefault()
        console.log(selectedANSTypes);
        console.log(selectedANSs);
    }

    return (
        <div>
            Report of A2P Dipping
            <form onSubmit={handleFormSubmit}>
                <div className='flex gap-x-2'>
                    <div className="card max-w-xs">
                        <MultiSelect value={selectedANSTypes} options={['MNO', 'IPTSP']} onChange={(e) => setSelectedANSTypes(e.value)}
                            placeholder="Select ANS Type" panelFooterTemplate={panelFooterTemplate} className="w-48 md:w-20rem" display="chip" />
                    </div>
                    <div className="card max-w-xs">
                        <MultiSelect value={selectedANSs} options={countries} onChange={(e) => setSelectedANSs(e.value)} optionLabel="name"
                            placeholder="Select ANS" itemTemplate={countryTemplate} panelFooterTemplate={panelFooterTemplate} className="w-48 md:w-20rem" display="chip" />
                    </div>
                    <div>
                        <Calendar
                            dateFormat="dd-mm-yy" value={fromDate} onSelect={(e) => { setFromDate(e.value) }} showIcon placeholder='From date*' />
                    </div>
                    <div>
                        <Calendar
                            dateFormat="dd-mm-yy" value={toDate} onSelect={(e) => { setToDate(e.value) }} showIcon placeholder='To date*' />
                    </div>
                    <Button type='submit' label='Submit' />
                </div>
            </form>
        </div>
    );
};

export default page;