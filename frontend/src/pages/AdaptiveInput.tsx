import { Type } from "../utils/TypeObject";

export interface AdaptiveInputProps {
    columnName: string,
    columnType: number
}

const AdaptiveInput = ({columnName, columnType} : AdaptiveInputProps ) => {
    if(columnType == Type.BOOL)
        return (
            <select
                name={columnName}
            >
                <option value={1}>True</option>
                <option value={0}>False</option>
            </select>
        )

    return (
        <input
            name={columnName}
        />
    )
};

export default AdaptiveInput;