import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse & {flush: Function}) {
  let intervalID: NodeJS.Timer | null = null
  let count = 0

  res.setHeader('Content-Type', 'text/event-stream')
  res.write(`data: {msg: Hello World!}\n\n`)
  res.flush()

  const end = () => {
    if (intervalID) {
      clearTimeout(intervalID)
    }
    res.end()
  }

  req.on('aborted', end)
  req.on('close', end)

  const sendData = () => {
    if (count === 3) return end()

    const timestamp = (new Date).toISOString()
    res.write(`\nevent: teste\ndata: {'time': ${timestamp}}\n\n}`)
    res.flush()
    count += 1
  }

  intervalID = setInterval(sendData, 1000)
}
