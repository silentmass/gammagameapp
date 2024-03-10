
export default function CanvasWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='flex min-h-screen flex-col justify-center items-center'>
            <div className='flex relative w-full h-full justify-center items-center'>
                {children}
            </div>
        </div>
    );
}