import Link from "next/link";
import LogoComponent from "../_components/Logo";
import LeftSideCover from "../_components/RightSideComponent";
import SignUpForm from "./_components/SignUpForm";

export default function page() {
  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">

      {/* left side form */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* logo component */}
        <LogoComponent />

        {/* main */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Create New Account</h1>
          <p className="text-text-color-muted text-sm mb-8">Begin your productive learning experience today.</p>
          <SignUpForm />
          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Already have an account?{' '}
            <Link href={"/login"} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden lg:block h-8"></div>
      </div>

      {/* right  component section */}
      <LeftSideCover />
    </div>
  )
}
