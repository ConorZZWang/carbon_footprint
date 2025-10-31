import React, { useState, useEffect } from "react";
import { useCalculator } from '../../context/CalculatorContext';
import "./CalculatorForm.css";

const StaffForm: React.FC = () => {
  const { calculator, notifyChange } = useCalculator();
  const [TOTAL_STAFF, setTotalStaff] = useState<number>(0);
  const [ASSIGNED_STAFF, setAssignedStaff] = useState<number>(0);
  

  const setStaff = () => {
    if (calculator) {
        calculator.setStaff({ TOTAL_STAFF: TOTAL_STAFF, ASSIGNED_STAFF: ASSIGNED_STAFF });
        notifyChange();
    }
  };

  return (
    <div className="section">
    <label>Total Staff: </label>
    <input type="number" value={TOTAL_STAFF} onChange={(e) => setTotalStaff(parseInt(e.target.value) || 0)} />
    <label>Assigned Staff: </label>
    <input type="number" value={ASSIGNED_STAFF} onChange={(e) => setAssignedStaff(parseInt(e.target.value) || 0)} />
    <button onClick={setStaff}>Update Staff</button>
  </div>
  );
};

export default StaffForm;
