import { signOut } from '@/auth';
import { LogoutCurve } from 'iconsax-react';
import { redirect } from 'next/navigation';

export function SignOut({
    provider, ...props
}: { provider?: string }) {

    return (
        <form
            action={async () => {
                "use server"
                await signOut();
                redirect('/logiin')
            }}
        >
            <button type='submit' className="flex items-center px-4 gap-5" {...props}>
                <LogoutCurve color="#E62020" size={20} />
                <span className="text-red">Logout</span>
            </button>
        </form>
    )
}