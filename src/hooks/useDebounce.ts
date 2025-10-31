import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number=500): T {
const [debouncedValue, SetDebouncedValue] = useState(value);

useEffect(() =>{
    const handler = setTimeout(() => {
        SetDebouncedValue (value);
    }, delay);

    return () => {
        clearTimeout(handler);
    };
},[value, delay]);

return debouncedValue;
}

export default useDebounce