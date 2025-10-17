 interface ErrorAlertProps {
  errors: string[];
}

export default function ErrorAlert({ errors }: ErrorAlertProps) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="bg-rose-50 text-rose-900 border border-rose-200 rounded-md px-3 py-2 mb-3">
      <ul>
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  );
}

 
