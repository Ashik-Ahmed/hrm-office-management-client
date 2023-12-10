'use client'
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';

const page = () => {
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false)
    const [selectedAggregators, setSelectedAggregators] = useState(null)
    const [selectedANSTypes, setSelectedANSTypes] = useState(null)
    const [selectedANSs, setSelectedANSs] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
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

    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.date.split("T")[0]}
            </div>
        )
    }

    const getA2PData = (e) => {
        setLoading(true)
        e.preventDefault()
        const queryDate = date.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-')
        fetch(`http://localhost:5000/api/v1/postgres?date=${queryDate}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setData(data.data)
            })
        setLoading(false)
    }

    const exportToExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'a2p_report');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const exportToPDF = () => {
        console.log('to pdf');
    }

    return (
        <div>
            Report of A2P Dipping
            <form onSubmit={getA2PData}>
                <div className='flex gap-x-2'>
                    <div className="card max-w-xs">
                        <MultiSelect value={selectedAggregators} options={['MNO', 'IPTSP']} onChange={(e) => setSelectedAggregators(e.value)}
                            placeholder="Select Aggregator" panelFooterTemplate={panelFooterTemplate} className="w-48 md:w-20rem" display="chip" />
                    </div>
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
                            dateFormat="dd-mm-yy" value={date} onSelect={(e) => { setDate(e.value) }} showIcon placeholder='To date*' />
                    </div>
                    <Button type='submit' label='Submit' />
                </div>
            </form>

            <div className='mt-4 p-2 bg-white'>
                <div className='flex gap-x-2 justify-end'>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                    </span>
                    <Button onClick={exportToExcel} type="button" icon="pi pi-file-excel" severity="success" disabled={!data} rounded data-pr-tooltip="XLS" />
                    <Button onClick={exportToPDF} type="button" icon="pi pi-file-pdf" severity="danger" disabled={!data} rounded data-pr-tooltip="PDF" />
                </div>
                <DataTable value={data} loading={loading} size='small' globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} emptyMessage="No previous application">
                    <Column body={dateBodyTemplate} header="Date"></Column>
                    <Column field="client_id" header="Client Id"></Column>
                    <Column field="operator" header="Operator"></Column>
                    {/* <Column field="cli" header="CLIe"></Column> */}
                    <Column field="sum" header="Dipping Count"></Column>
                    <Column field="message_type" header="Message Type"></Column>
                    {/* <Column field="totalDay" header="Total"></Column>
                    <Column field="currentStatus.status" header="Current Status"></Column> */}
                </DataTable>
            </div>
        </div>
    );
};

export default page;