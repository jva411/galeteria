import { ReactElement } from 'react'


interface CardProps {
    className?: string
    children?: ReactElement  | ReactElement[]
}


export default function Card({ className, children }: CardProps) {
    const styles = (className || '') + ' flex flex-row justify-center items-center w-[10rem] h-[10rem] rounded-[0.8rem] border-solid border-[1px] border-black'

    return <div className={styles}>
        {children}
    </div>
}
