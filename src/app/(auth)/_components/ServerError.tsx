export default function ServerError({serverError} : {serverError: string}) {
    return (

        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5 text-red-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-700">
                        Authentication Failed
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {serverError}
                    </p>
                </div>
            </div>
        </div>
    )
}