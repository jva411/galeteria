import { useEffect } from 'react'


export default function Index() {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sse = new EventSource("/api/hello")
      sse.onmessage = e => [console.log('Message'), console.log(e.data)]
      sse.addEventListener('teste', e => [console.log('Teste'), console.log(e.data)])
      sse.onerror = () => sse.close()
    }
  }, [])

  return (
    <>
    </>
  )
}
