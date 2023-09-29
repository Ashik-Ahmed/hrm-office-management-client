'use client'
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const MonthlyRequisitionDataTable = () => {
    return (
        <div>
            <DataTable value={userRequisitionData?.data} size='small' emptyMessage="No Requisition Found">
                <Column body={dateBodytemplate} header="Date"></Column>
                <Column field='department' header="Department"></Column>
                <Column field='totalProposedItems' header="#Proposed item(s)"></Column>
                {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                <Column field="proposedAmount" header="Proposed Amount"></Column>
                {/* <Column field="finalAmount" header="Final Amount"></Column> */}
                <Column field="status" header="Status"></Column>
                <Column body={actionBodyTemplate} header="Action"></Column>
            </DataTable>
        </div>
    );
};

export default MonthlyRequisitionDataTable;