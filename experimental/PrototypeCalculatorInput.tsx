import React, { useState } from 'react';

const InputComponent = () => {
    // Initialize state for input values
    const [inputs, setInputs] = useState({
        TOTAL_STAFF: '',
        STAFF_ASSIGNED: '',
        PHYSICAL_LAB_AREA: '',
        MEDICAL_LAB_AREA: '',
        ENGINEERING_LAB_AREA: '',
        ADMIN_OFFICE: '',
        ACADEMIC_OFFICE: '',
        CAR: '',
        MOTORBIKE: '',
        TAXI: '',
        BUS: '',
        COACH: '',
        NATIONAL_RAIL: '',
        INTERNATIONAL_RAIL: '',
        LIGHT_RAIL_AND_TRAM: '',
        MIXED_RECYCLING: '',
        GENERAL_WASTE: '',
        CLINICAL_WASTE: '',
        CHEMICAL_WASTE: '',
        BIOLOGICAL_WASTE: '',
        WEEE_MIXED_RECYCLING: ''
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <h1>Project Calculator</h1>
            <h2>Staff</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="TOTAL_STAFF"
                    value={inputs.TOTAL_STAFF}
                    onChange={handleChange}
                    placeholder="Total Staff"
                />
                <input
                    type="number"
                    name="STAFF_ASSIGNED"
                    value={inputs.STAFF_ASSIGNED}
                    onChange={handleChange}
                    placeholder="Staff Assigned to Project"
                />
            </div>
            <h2>Areas (m^2)</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="PHYSICAL_LAB_AREA"
                    value={inputs.PHYSICAL_LAB_AREA}
                    onChange={handleChange}
                    placeholder="Physical Lab"
                />
                <input
                    type="number"
                    name="MEDICAL_LAB_AREA"
                    value={inputs.MEDICAL_LAB_AREA}
                    onChange={handleChange}
                    placeholder="Medical Lab"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="ENGINEERING_LAB_AREA"
                    value={inputs.ENGINEERING_LAB_AREA}
                    onChange={handleChange}
                    placeholder="Engineering Lab"
                />
                <input
                    type="number"
                    name="ADMIN_OFFICE"
                    value={inputs.ADMIN_OFFICE}
                    onChange={handleChange}
                    placeholder="Admin Office"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="ACADEMIC_OFFICE"
                    value={inputs.ACADEMIC_OFFICE}
                    onChange={handleChange}
                    placeholder="Academic Office"
                />
            </div>
            <h2>Transport (km)</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="CAR"
                    value={inputs.CAR}
                    onChange={handleChange}
                    placeholder="Car"
                />
                <input
                    type="number"
                    name="MOTORBIKE"
                    value={inputs.MOTORBIKE}
                    onChange={handleChange}
                    placeholder="Motorbike"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="TAXI"
                    value={inputs.TAXI}
                    onChange={handleChange}
                    placeholder="Taxi"
                />
                <input
                    type="number"
                    name="BUS"
                    value={inputs.BUS}
                    onChange={handleChange}
                    placeholder="Bus"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="COACH"
                    value={inputs.COACH}
                    onChange={handleChange}
                    placeholder="Coach"
                />
                <input
                    type="number"
                    name="NATIONAL_RAIL"
                    value={inputs.NATIONAL_RAIL}
                    onChange={handleChange}
                    placeholder="National Rail"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="INTERNATIONAL_RAIL"
                    value={inputs.INTERNATIONAL_RAIL}
                    onChange={handleChange}
                    placeholder="International Rail"
                />
                <input
                    type="number"
                    name="LIGHT_RAIL_AND_TRAM"
                    value={inputs.LIGHT_RAIL_AND_TRAM}
                    onChange={handleChange}
                    placeholder="Light Rail and Tram"
                />
            </div>
            <h2>Waste (kg)</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="MIXED_RECYCLING"
                    value={inputs.MIXED_RECYCLING}
                    onChange={handleChange}
                    placeholder="Mixed Recycling"
                />
                <input
                    type="number"
                    name="GENERAL_WASTE"
                    value={inputs.GENERAL_WASTE}
                    onChange={handleChange}
                    placeholder="General waste"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="CLINICAL_WASTE"
                    value={inputs.CLINICAL_WASTE}
                    onChange={handleChange}
                    placeholder="Clinical waste"
                />
                <input
                    type="number"
                    name="CHEMICAL_WASTE"
                    value={inputs.CHEMICAL_WASTE}
                    onChange={handleChange}
                    placeholder="Chemical waste"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    name="BIOLOGICAL_WASTE"
                    value={inputs.BIOLOGICAL_WASTE}
                    onChange={handleChange}
                    placeholder="Biological waste"
                />
                <input
                    type="number"
                    name="WEEE_MIXED_RECYCLING"
                    value={inputs.WEEE_MIXED_RECYCLING}
                    onChange={handleChange}
                    placeholder="WEEE mixed recycling"
                />
            </div>
            
            
        </div>
        
    );
};

export default InputComponent;
