import Link from "next/link";
import LogoComponent from "../_components/Logo";
import LeftSideCover from "../_components/RightSideComponent";
import LoginForm from "./_components/SignInForm";


export default function page() {
  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">

      {/* left */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* logo */}
        <LogoComponent />

        {/* main */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Login</h1>
          <p className="text-text-color-muted text-sm mb-8">Welcome back! Sign in to continue your learning journey.</p>
          <LoginForm />

          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Does not have an account?{' '}
            <Link href={"/register"} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>

        <div className="hidden lg:block h-8"></div>
      </div>

      {/* right side component */}
      <LeftSideCover />
    </div>

  )
}
