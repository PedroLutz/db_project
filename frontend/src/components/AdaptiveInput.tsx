import type React from "react";
import { Type } from "../utils/TypeObject";

export interface AdaptiveInputProps {
    name: string;
    type: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    placeholder: string | undefined;
}

const AdaptiveInput = ({name, type, value, onChange, placeholder} : AdaptiveInputProps ) => {
    const intChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        onChange(e);
    }

    if(type == Type.BOOL)
        return (
            <select
                name={name}
                value={value ?? ""}
                onChange={onChange}
            >
                <option defaultValue="">{placeholder}</option>
                <option value={1}>True</option>
                <option value={0}>False</option>
            </select>
        )

    if(type == Type.INT)  
        return (
            <input
                name={name}
                value={value ?? 0}
                onChange={intChangeHandler}
                placeholder={placeholder}
                type="number"
            />
    )

    if(type == Type.FLOAT)
        return (
            <input
                name={name}
                value={value ?? 0}
                onChange={onChange}
                placeholder={placeholder}
                type="number"
            />
        )

    if(type == Type.STRING)
        return (
            <input
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                type="text"
            />
        )
};

export default AdaptiveInput;