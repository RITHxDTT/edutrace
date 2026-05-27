import Link from 'next/link'
import VerifyEmailForm from './_components/VerifyEmailForm'

export default function page() {
      return (
            <div className="flex flex-col justify-center h-screen w-full lg:w-[45%] p-8 sm:p-12 md:p-16 bg-white">

                  <div className="w-full max-w-xl mx-auto my-auto py-8 flex flex-col items-cente gap-8">
                        <div>
                              <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">Verify Email</h1>
                              <p className="text-border-focus">Enter your email and the 6 digits code that you received from your email to verify.</p>
                        </div>

                        <div>
                              <VerifyEmailForm />
                              <div className='text-center'>
                                    <p className="text-sm text-strong/80 mt-6">
                                          Back to{' '}
                                          <Link href={"/login"} className="bg-linear-purple bg-clip-text text-transparent hover:cursor-pointer underline">
                                                Sign in
                                          </Link>
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      )
}
