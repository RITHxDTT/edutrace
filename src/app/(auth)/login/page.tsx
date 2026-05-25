import Link from "next/link";
import LoginForm from "./_components/SignInForm";

export default function page() {
  return (

    <div className="flex flex-col justify-center h-screen w-full lg:w-[45%] p-8 sm:p-12 md:p-16 bg-white">
      <div className="w-full max-w-xl mx-auto flex flex-col justify-center">

        <div className="flex flex-col">
          <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">
            Login
          </h1>

          <p className="text-border-focus mb-8">
            Welcome back! Sign in to continue your learning journey.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-text-color-strong/80 mt-6">
          Does not have an account?{" "}
          <Link
            href={"/register"}
            className="bg-linear-purple bg-clip-text text-transparent underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}