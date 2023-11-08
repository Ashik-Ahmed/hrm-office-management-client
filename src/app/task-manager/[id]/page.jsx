import React from 'react';

const page = ({ params: { id } }) => {
    return (
        <div>
            Task id is {id}
        </div>
    );
};

export default page;