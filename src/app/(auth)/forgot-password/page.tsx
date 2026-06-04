import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default function page() {
  return (
    <div className="flex flex-col justify-center h-screen w-full lg:w-[45%] p-8 sm:p-12 md:p-16 bg-white">
      <div className="w-full max-w-xl mx-auto my-auto py-8 flex flex-col gap-8">

        <div>
          <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">
            Forgot Password
          </h1>

          <p className="text-border-focus">
            Enter your email to reset your password.
          </p>
        </div>

        <div>
          <ForgotPasswordForm />
          <div className="text-center">
            <p className="text-sm text-text-color-strong/80 mt-6">
              Back to{" "}
              <Link
                href="/login"
                className="bg-linear-purple bg-clip-text text-transparent underline hover:cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}