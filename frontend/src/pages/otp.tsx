import React,{ useEffect, useRef, useState } from 'react';
import AxiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Props{
    name:string,
    email:string
}

const OTPVerification:React.FC<Props> = React.memo(({name,email}) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string>(''); // State to store the OTP
  const navigate = useNavigate()

  useEffect(() => {
    const form = formRef.current;
    const inputs = inputsRef.current;
    const submit = form?.querySelector('button[type=submit]') as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      const index = inputs.indexOf(target);

      if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey) {
        e.preventDefault();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (target.value === '') {
          if (index > 0) {
            inputs[index - 1]?.focus();
            inputs[index - 1]!.value = '';
            updateOtp();
          }
        } else {
          target.value = '';
        }
        e.preventDefault();
      }

      // Handle Ctrl + V for pasting via keyboard shortcut
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        navigator.clipboard.readText().then((pastedText) => {
          handlePaste(pastedText);
        });
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const index = inputs.indexOf(target);
      if (target.value) {
        if (index < inputs.length - 1) {
          inputs[index + 1]?.focus();
        } else {
          submit?.focus();
        }
      }
      updateOtp(); // Update the OTP state whenever input changes
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      target.select();
    };

    const handlePaste = (pastedText: string) => {
      const digits = pastedText.replace(/\D/g, '').split('');
      if (digits.length > 0) {
        digits.slice(0, inputs.length).forEach((digit, index) => {
          if (inputs[index]) {
            inputs[index]!.value = digit;
          }
        });

        const nextIndex = digits.length < inputs.length ? digits.length : inputs.length - 1;
        if (inputs[nextIndex]) {
          inputs[nextIndex].focus();
        } else {
          submit?.focus();
        }
        updateOtp(); // Update OTP state after paste
      }
    };

    const handlePasteEvent = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData('text') || '';
      handlePaste(pastedText);
    };

    inputs.forEach((input) => {
      input?.addEventListener('input', handleInput);
      input?.addEventListener('keydown', handleKeyDown);
      input?.addEventListener('focus', handleFocus);
      input?.addEventListener('paste', handlePasteEvent);
    });

    return () => {
      inputs.forEach((input) => {
        input?.removeEventListener('input', handleInput);
        input?.removeEventListener('keydown', handleKeyDown);
        input?.removeEventListener('focus', handleFocus);
        input?.removeEventListener('paste', handlePasteEvent);
      });
    };
  }, []);

  // Function to update OTP state based on input values
  const updateOtp = () => {
    const otpValue = inputsRef.current.map((input) => input?.value || '').join('');
    setOtp(otpValue);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
       if(otp.length===6){
        AxiosInstance.post('/user/verifyOtp',{otp,name,email})
        .then((res)=>{
          toast.success(res.data.message)
          localStorage.setItem('userData', JSON.stringify({ id: res.data.id, name }));
          navigate('/')

        }).catch((error)=>{
           toast.error(error)
        })
       }else{
        toast.error('Otp must be of 6 digits')
       }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };


  return (
    <div className='justify-center items-center flex fixed top-0 left-0 z-10 w-full h-full bg-black bg-opacity-45'>
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 6-digit verification code that was sent to your email.
          </p>
        </header>
        <form id="otp-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength={1}
                pattern="\d*"
                onChange={updateOtp} // Set OTP on change
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{' '}
          <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">
            Resend
          </a>
        </div>
      </div>
    </div>
  );
});

export default OTPVerification;
