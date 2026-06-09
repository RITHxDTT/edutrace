import Link from "next/link";
import LoginForm from "./_components/SignInForm";

export default function page() {
  return (
    <div className="flex flex-col justify-center items-center w-full xl:w-[45%] bg-white px-6">
      <div className="w-full max-w-xl py-8 flex flex-col gap-8">

        <div>
          <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">
            Login
          </h1>
          <p className="text-border-focus">
            Welcome back! Sign in to continue your learning journey.
          </p>
        </div>

        <div>
          <div className="w-full mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Demo Login Accounts</p>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="p-3 rounded-lg bg-white border">
                <p className="font-semibold text-blue-600">Teacher</p>
                <p>Email: Teacher@gmail.com</p>
                <p>Password: Teacher@2026</p>
              </div>
              <div className="p-3 rounded-lg bg-white border">
                <p className="font-semibold text-green-600">Student</p>
                <p>Email: vuththanakeo69@gmail.com</p>
                <p>Password: Vuththana@123</p>
              </div>
            </div>
          </div>

          <LoginForm />

          <div className="text-center">
            <p className="text-sm text-text-color-strong/80 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="bg-linear-purple bg-clip-text text-transparent underline hover:cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}