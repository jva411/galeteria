
import Link from 'next/link'
import styles from '/styles/components/header.module.scss'


function Header() {
    return <header className={styles.header}>
        <span>Disk Frango Real</span>
        <nav>
            <Link href='/'>Início</Link>
            <Link href='/planilha'>Planilha</Link>
            <Link href='/entregadores'>Entregadores</Link>
        </nav>
    </header>
}


export default Header
