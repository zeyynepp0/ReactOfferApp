
type InputValueType = "Onaylandı" | "Taslak";

type ButtonInputProps = {
    value?: InputValueType,
    onChange?: (value: InputValueType) => void
}

const ButtonInput = ({ onChange, value }: ButtonInputProps) => {
    return (
        <div className='flex flex-row gap-2'>
            {["Onaylandı", "Taslak"].map((x) => <button style={{ backgroundColor: value === x ? 'red' : "" }} onClick={() => onChange?.(x as InputValueType)}>{x}</button>)}
        </div>
    )
}

export default ButtonInput