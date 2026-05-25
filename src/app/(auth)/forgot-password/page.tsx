import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default function page() {
  return (
    <div className="flex flex-col justify-center h-screen w-full lg:w-[45%] p-8 sm:p-12 md:p-16 bg-white">
      <div className="w-full max-w-xl mx-auto flex flex-col justify-center">

        <div>
          <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">Forgot Password</h1>
          <p className="text-border-focus mb-8">Enter your email to enable setting new password.</p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-text-color-strong/80 mt-6">
          Back to{' '}
          <Link
            href={"/login"}
            className="bg-linear-purple bg-clip-text text-transparent hover:cursor-pointer underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
