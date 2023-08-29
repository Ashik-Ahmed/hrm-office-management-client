'use client'

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';

const Conveyance = ({ conveyance, session }) => {

    const isFirstRender = useRef(true);
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedyear] = useState(new Date())
    const [conveyanceData, setConveyanceData] = useState(conveyance)
    const [totalIconColor, setTotalIconColor] = useState('gray')
    const [dueIconColor, setDueIconColor] = useState('gray')
    const [addConveyanceDialog, setAddConveyanceDialog] = useState(false)
    const [date, setDate] = useState(null);
    const [attachment, setAttachment] = useState(null);

    const getConveyanceData = () => {
        console.log("fetching data");
        const filterMonth = new Date(selectedMonth).getMonth() + 1;
        const filterYear = new Date(selectedYear).getFullYear();
        console.log(filterMonth, filterYear);
        const url = `http://localhost:5000/api/v1/conveyance/${session.user.email}?month=${filterMonth}&year=${filterYear}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                setConveyanceData(data?.data)
            })
    }

    useEffect(() => {
        // Do not fetch data on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            // Fetch data
            getConveyanceData()
        }
    }, [selectedMonth, selectedYear])

    const handlePhotoChange = (event) => {
        setAttachment(event.target.files[0]);
    };

    const handleAddConveyance = (data) => {

        data.date = data.date.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        // console.log(data.date);
        const employee = {
            name: session.user.name,
            email: session.user.email
        }
        data.employee = employee;

        fetch('http://localhost:5000/api/v1/conveyance', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    console.log("Conveyance created");
                    getConveyanceData()
                }
                else {
                    console.log("Failed");
                }
            })

        // setAddConveyanceDialog(false)
        reset();
    }


    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.date.split("T")[0]}
            </div>
        )
    }

    return (
        <div>
            <div className='flex gap-x-2'>
                <Calendar onChange={(e) => { setSelectedMonth((e.value)); console.log(e.value); }} value={selectedMonth} view="month" dateFormat="MM" size='small' className='p-dropdown-sm' />
                <Calendar onChange={(e) => { setSelectedyear(e.value); console.log(e.value); }} value={selectedYear} view="year" dateFormat="yy" size='small' className='p-dropdown-sm' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>

            <div className='mt-4 flex gap-x-2'>
                <div onMouseEnter={() => setTotalIconColor('white')} onMouseLeave={() => setTotalIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <TbReportMoney size={60} color={totalIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Total Amount</p>
                        <p className='text-3xl font-bold'>&#2547; {`${conveyanceData.totalAmount || "00"} `} </p>
                    </div>
                </div>
                <div onMouseEnter={() => setDueIconColor('white')} onMouseLeave={() => setDueIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <MdOutlinePendingActions size={55} color={dueIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Due</p>
                        <p className='text-3xl font-bold'>&#2547; {`${conveyanceData.totalDueAmount || "00"}`}</p>
                    </div>
                </div>
            </div>

            <div className='mt-4'>
                <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                    <div className='flex items-center gap-x-2 mb-2'>
                        <h3 className='font-light'>CONVEYANCE DETAILS</h3>
                        <AiFillPlusSquare onClick={() => setAddConveyanceDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                    </div>
                    {
                        conveyanceData.conveyanceDetails.length > 0 ?
                            <DataTable value={conveyanceData.conveyanceDetails} size='small' emptyMessage="No Due Conveyance">
                                <Column field='from' header="From"></Column>
                                <Column field='destination' header="Destination"></Column>
                                <Column body={dateBodyTemplate} header="Date"></Column>
                                <Column field="amount" header="Amount"></Column>
                                <Column field="paymentStatus" header="Payment Status"></Column>
                            </DataTable>
                            :
                            <div className='my-4 text-center'>
                                <p className='bg-sky-400 text-white p-2 inline'>No Due Conveyance</p>
                            </div>
                    }
                </div>
                {/* add Conveyance dialog  */}
                <Dialog header="Add Conveyance" visible={addConveyanceDialog} style={{ width: '50vw' }} onHide={() => { setAddConveyanceDialog(false); setDate(null); reset() }}>

                    <form onSubmit={handleSubmit(handleAddConveyance)} className='mt-2'>
                        <div className='mt-2 flex gap-x-4'>
                            <div className='w-full'>
                                {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                                {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{ required: "Date is required" }}
                                    render={({ field }) => (
                                        <Calendar
                                            value={date}
                                            onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                            placeholder='Date*'
                                            className='w-full'
                                            dateFormat="dd-mm-yy"
                                        />
                                    )}
                                />
                                {errors.date?.type === 'required' && <span className='text-xs text-red-500 block' role="alert">{errors.date.message}</span>}
                            </div>

                            <div className='w-full'>
                                <InputText
                                    {...register("amount", { required: "Amount is required" })}
                                    keyfilter='int' placeholder="Amount*" className='w-full' />
                                {errors.amount?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.amount.message}</span>}
                            </div>
                        </div>
                        <div className='mt-2 flex gap-x-4'>
                            <div className='w-full'>
                                <InputText
                                    {...register("from", { required: "From location required" })}
                                    type='text' placeholder="From*" className='w-full' />
                                {errors.from?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.from.message}</span>}
                            </div>
                            <div className='w-full'>
                                <InputText
                                    {...register("destination", { required: "Destination location required" })}
                                    type='text' placeholder="Destination*" className='w-full' />
                                {errors.destination?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.destination.message}</span>}
                            </div>
                        </div>
                        <div className='mt-2 flex gap-x-4'>
                            <div className='w-full'>
                                <InputText
                                    {...register("purpose")}
                                    placeholder="Purpose" className='w-full' />
                                {errors.purpose?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.purpose.message}</span>}
                            </div>
                            <div className='w-full'>
                                <InputText
                                    {...register("partner")}
                                    placeholder="Travel Partner" className='w-full' />
                                {errors.partner?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.partner.message}</span>}
                            </div>
                        </div>
                        <div className='mt-2'>
                            <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                        </div>

                        <div className='mt-4 text-right'>
                            <Button type='submit' label="Submit" icon="pi pi-check" className="p-button-sm" loading={loading} />
                        </div>
                    </form>
                </Dialog>
            </div>
        </div>
    );
};

export default Conveyance;