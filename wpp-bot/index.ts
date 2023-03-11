import { create } from "@open-wa/wa-automate"

create().then(async client => {
    await client.onMessage(message => {
        console.log(message.sender.pushname)
    })

    console.log('bot iniciado!')
})
