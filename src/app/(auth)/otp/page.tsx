
import OTPForm from './_components/OtpComponents';

export default function Page() {

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-[45%] bg-white px-6">

      <div className="w-full max-w-xl py-8 flex flex-col gap-8">

        <div>

          <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">
            Enter Verification Code
          </h1>

          <p className="text-border-focus">
            Enter 6 digits code that you received from your email.
          </p>

        </div>

        <OTPForm />

      </div>

    </div>
  );
}

