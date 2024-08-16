import React from "react";
import { facilityTypes } from "../config/hotelOptionsConfig";


type Props = {
    selectedFacilityTypes: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FacilitiesFilter = ({ selectedFacilityTypes, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Facilities</h4>
            {facilityTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        className="rounded" 
                        value={type} 
                        checked={selectedFacilityTypes.includes(type)}
                        onChange={onChange}
                        />
                        <span>{type}</span>
                </label>
            ))}
        </div>
    )
}

export default FacilitiesFilter;