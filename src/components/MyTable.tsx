import { useState, type ReactNode } from 'react'

type ColumnType<T> = {// generic type tanımı 
    header: ReactNode,
    fieldKey: keyof T;

}

type MyTableProps<T> = {// generic prop tanımı. 
    columns: ColumnType<T>[],
    data?: T[]
    emptyDataText?: string;
    onRowClick?: (data: T) => void;//  satır tıklama fonksiyonu
}

const MyTable = <T,>({ columns, data, emptyDataText, onRowClick }: MyTableProps<T>) => {// generic component tanımı
    const [value, setValue] =useState("");

    const filteredData = data?.filter(d => {// her kolon için arama yapar
        return columns.some(col => {
            const fieldValue = d[col.fieldKey];
            return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
        })})

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }



    return (
       <div>
        <input className='border border-gray-400 rounded' value={value} onChange={onInputChange}/>
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    {columns.map((col) => <th key={col.fieldKey as string} className="bg-slate-200 p-3 text-left font-semibold">{col.header}</th>)}
                </tr>
            </thead>
            <tbody>
                {data?.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center text-gray-500 p-4">
                            {emptyDataText ?? "Henüz kayıt bulunmuyor."}
                        </td>
                    </tr>
                ) : (
                    filteredData?.map((d, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => {
                                onRowClick?.(d)
                            }}
                        >
                            {columns.map((x) => (
                                <td key={x.fieldKey as string} className="p-3 border-b border-slate-100">{d[x.fieldKey as keyof typeof d] as any}</td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
       </div> 

    )
}

export default MyTable