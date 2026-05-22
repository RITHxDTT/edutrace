import { signOut } from '@/auth';
import { LoginCurve } from 'iconsax-react';

export function SignOut({
    provider, ...props
}: { provider?: string }) {

    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <button type='submit' className="flex items-center px-4 gap-5" {...props}>
                <LoginCurve color="#E62020" size={20} />
                <span className="text-red">Logout</span>
            </button>
        </form>
    )
}