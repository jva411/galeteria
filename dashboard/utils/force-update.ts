import { useState } from 'react'


export default function useForceUpdate() {
    const [state, setState] = useState(false)
    return () => setState(!state)
}
