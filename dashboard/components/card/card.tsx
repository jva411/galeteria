import { ReactElement } from 'react'


export default function Card({ className, children }: React.HTMLProps<HTMLDivElement>) {
    const styles = `flex flex-row justify-center items-center w-[10rem] h-[10rem]
    rounded-[0.8rem] border-[0.1rem] border-black bg-white ` + (className || '')

    return <div className={styles}>
        {children}
    </div>
}
