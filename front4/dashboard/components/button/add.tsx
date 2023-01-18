import { MouseEventHandler } from 'react';
import { BiPlus } from 'react-icons/bi'


interface AddButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}


export default function AddButton({ onClick }: AddButtonProps) {
    const styles = `w-[5rem] h-[5rem] rounded-full border-green-500 border-[0.1rem] flex justify-center items-center
    text-[3.5rem] text-green-500 cursor-pointer hover:text-white hover:bg-green-500 duration-100`
    return <button
        type='button'
        onClick={onClick}
        className={styles}
    >
        <BiPlus />
    </button>
}
