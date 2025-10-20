import React from 'react'
//import { pl } from 'zod/v4/locales';


//extends = miras almak, genişletmek demek.
//React.InputHTMLAttributes<HTMLInputElement> = HTML <input> elementinin tüm geçerli özelliklerini (props) kapsar.
//Örnekler: placeholder, value, onChange, type, name, id, disabled, required, className, autoFocus, vs.
//Yani bizim InputProps’umuz hem label, error gibi özel prop’lara sahip olacak, hem de standart HTML input prop’larını alabilecek.

interface OptionType {
  label: string;
  value: string;
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  type?: string;
  error?: string;
  options?: OptionType[];
}

const Input = React.forwardRef<HTMLInputElement | HTMLSelectElement,InputProps
>(({ label, error, type = "text", options, ...props }, ref) => {
  const isSelect = type === "select";

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      {isSelect ? (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

export default Input;