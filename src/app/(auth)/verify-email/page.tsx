import Link from 'next/link'
import VerifyEmailForm from './_components/VerifyEmailForm'
import { Suspense } from 'react'

export default function page() {
      return (
            <div className="flex flex-col justify-center h-screen w-full xl:w-[45%] p-8 sm:p-12 md:p-16 bg-white">

                  <div className="w-full max-w-xl mx-auto my-auto py-8 flex flex-col items-cente gap-8">
                        <div>
                              <h1 className="text-[40px] font-medium bg-linear-purple bg-clip-text text-transparent mb-2">Enter OTP Code</h1>
                              <p className="text-border-focus">Enter the otp code to verify your email..</p>
                        </div>

                        <div>
                              <Suspense fallback={<div>Loading...</div>}>
                                    <VerifyEmailForm />
                              </Suspense>
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
