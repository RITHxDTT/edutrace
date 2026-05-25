import Link from "next/link";
import SignUpForm from "./_components/SignUpForm";

export default async function page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classrooms`);
  const classrooms = await res.json();
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full lg:w-[45%] xl:w-[55%] min-h-screen flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-white">

        <div className="w-full h-full max-w-xl mx-auto flex flex-col justify-center gap-8">
          <div>
            <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">
              Create New Account
            </h1>

            <p className="text-border-focus mb-8">
              Begin your productive learning experience today.
            </p>
          </div>

          <SignUpForm classrooms={classrooms.payload} />

          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="bg-linear-purple bg-clip-text text-transparent hover:cursor-pointer underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden lg:block h-8"></div>
      </div>
    </div>
  )
}
