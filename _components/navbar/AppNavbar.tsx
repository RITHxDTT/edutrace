import { User } from 'lucide-react'
import { FaSearch } from 'react-icons/fa'

export default function AppNavbar() {
    return (
        <nav className='h-20 p-4 rounded-bl-2xl bg-accent-ice'>
            <div className='flex items-center justify-between'>
                {/* Search Input */}
                <div className='relative flex items-center flex-1 min-w-[200px] max-w-md bg-white'>
                    <FaSearch className='absolute left-3 text-muted-foreground' />
                    <input
                        type="text"
                        placeholder='Search'
                        className='w-full border-accent-light-gray border placeholder:text-right pl-10 pr-4 py-2 rounded-xl font-semibold focus:text-black'
                    />
                </div>

                <div className='max-w-[300px]'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center rounded-full border bg-white size-14 shrink-0'>
                            <User />
                        </div>

                        <div className='flex flex-col min-w-0'>
                            <span className='text-xl font-semibold'>User</span>
                            <span className='text-sm'>user@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}