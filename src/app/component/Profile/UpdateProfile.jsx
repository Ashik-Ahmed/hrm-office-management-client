'use client'

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const UpdateProfile = ({ employee, department, getEmployeeData, setUpdateForm, toast, accessToken }) => {

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [image, setImage] = useState('')

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpdateProfile = async (data) => {

        const updatedData = {};

        for (const property in data) {
            if (data[property] !== "") {
                updatedData[property] = data[property];
            }
        }
        console.log(updatedData);

        try {
            if (image) {

                const userPhoto = new FormData()
                userPhoto.append('image', image)

                await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
                    method: 'POST',
                    body: userPhoto
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.data.url) {
                            updatedData.image = data.data.url;
                            fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/${employee._id}`, {
                                method: 'PATCH',
                                headers: {
                                    "content-type": "application/json",
                                    "Authorization": `Bearer ${accessToken}`
                                },
                                body: JSON.stringify(updatedData)
                            })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data);
                                    if (data.status == "Success") {
                                        console.log("Updated Successfully");
                                        toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Profile Updated', life: 3000 });
                                        getEmployeeData(employee._id);
                                    }
                                    else {
                                        console.log("Failed to update");
                                        toast?.current?.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again', life: 3000 });
                                    }
                                })
                        }
                    })
            }
            else {
                fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/${employee._id}`, {
                    method: 'PATCH',
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(updatedData)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.status == "Success") {
                            console.log("Updated Successfully");
                            toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Profile Updated', life: 3000 });
                            getEmployeeData(employee._id);
                        }
                        else {
                            console.log("Failed to update");
                            toast?.current?.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again', life: 3000 });
                        }
                    })
            }


        } catch (error) {
            console.error('Error occurred during image upload:', error);
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Photo upload failed', life: 3000 });
        }
        reset()
        setUpdateForm(false)

    }

    return (
        <div className='w-2/3 bg-white rounded mx-4 p-4 h-fit'>
            <p className='text-xl font-bold text-gray-800 inline p-1'>Update Profile</p>

            <form onSubmit={handleSubmit(handleUpdateProfile)}>
                <div className='mt-4'>
                    <div className='flex gap-4 justify-between'>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text text-gray-700">First Name</span>
                            </label>
                            <InputText
                                {...register("firstName")}
                                type="text" placeholder={employee?.firstName || "Type here"} className="w-full max-w-xs  text-gray-700" />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text text-gray-700">Last Name</span>
                            </label>
                            <InputText
                                {...register("lastName")}
                                type="text" placeholder={employee?.lastName || "Type here"} className="w-full max-w-xs  text-gray-700" />
                        </div>
                    </div>
                    <div className='flex gap-4 justify-between mt-2'>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text text-gray-700">Department</span>
                            </label>
                            <Dropdown
                                {...register("department")}
                                value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value) }} options={department} optionLabel='departmentName' placeholder="Select Department*" className="w-full placeholder-opacity-20" />

                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text text-gray-700">Designation</span>
                            </label>
                            <InputText
                                {...register("designation")}
                                type="text" placeholder={employee?.designation || "Type here"} className="w-full max-w-xs  text-gray-700" />
                        </div>
                    </div>
                    <div className='flex gap-4 justify-between mt-2'>
                        <div class="form-control w-full max-w-xs flex flex-col">
                            <label class="label">
                                <span class="label-text text-gray-700">Email</span>
                            </label>
                            <InputText
                                {...register("email")}
                                type="text" placeholder={employee?.email || "Type here"} keyfilter='int' className="w-full max-w-xs  text-gray-700" />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text text-gray-700">Mobile</span>
                            </label>
                            <InputText
                                {...register("mobile")}
                                type="text" placeholder={employee?.mobile || "Type here"} keyfilter='int' className="w-full max-w-xs  text-gray-700" />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div>
                </div>
                <div className='flex justify-end mt-4 gap-x-2'>
                    {/* <button type='submit' className='btn btn-sm bg-primary hover:bg-secondary border-0 my-4'>Update</button> */}
                    <Button label="Cancel" onClick={() => {
                        setUpdateForm(false);
                    }} className="p-button-danger p-button-sm normal-case" />
                    <Button type='submit' label="Submit" className=' p-button-info p-button-sm btn-primary normal-case' />
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;