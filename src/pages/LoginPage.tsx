import React from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useValidation } from "../hooks/useValidation";
import { loginSchema, type LoginFormData } from "../schemas/validationSchemas";
import ValidationAlert from "../components/ValidationAlert";

// Basit demo login sayfası (admin/123)
export default function LoginPage() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLoginForm();
  const { errors, validate, clearErrors, setCustomErrors } = useValidation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const formData: LoginFormData = { email, password };
    const validation = validate(loginSchema, formData);
    
    if (!validation.success) {
      return;
    }

    try {
      handleSubmit(e);
    } catch (error) {
      setCustomErrors([error instanceof Error ? error.message : "Bir hata oluştu"]);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[linear-gradient(135deg,#aabed3,#fed6e3)]">
      <form 
        className="bg-white px-10 py-10 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-[350px] max-w-[90%] text-center" 
        onSubmit={handleFormSubmit}
      >
        <h2 className="w-[107%] mb-7 text-[#f5a1bb] text-[50px]">Login</h2>
        <input
          className="w-full p-3 my-[10px] border border-[#f5a1bb] rounded-lg text-[15px] focus:border-[#aabed3] outline-none"
          type="text"
          placeholder="Kullanıcı adı"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 my-[10px] border border-[#f5a1bb] rounded-lg text-[15px] focus:border-[#aabed3] outline-none"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="w-[107%] p-3 bg-[#f5a1bb] text-white rounded-lg text-[16px] font-medium mt-[10px] transition-colors hover:bg-[#aabed3]" 
          type="submit"
        >
          Login
        </button>
      </form>
      
      <ValidationAlert 
        errors={errors} 
        onClose={clearErrors}
        autoClose={true}
        autoCloseDelay={5000}
      />
    </div>
  );
}