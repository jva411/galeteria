import React from 'react'
import Select from 'react-select'
import styles from '~/styles/components/select.module.css'

export default function MySelect({ handleSelectOption, ...props }){

    return (
        <Select
            className={styles.select}
            {...props}
            onChange={option => handleSelectOption(option)}
        />
    )
}
