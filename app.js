const conf = require('./config.json')
const baseClasses = require('./baseClasses')
const Db = require('./db')
const bot = require('./bot')
const hid = require('./hid')

const db = new Db.Sqlite(conf.db.dbFile)
const device = new HID.HID(conf.scanner.path)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/*  KEY CODE
    0x1e : 1
    0x1f : 2
    0x20 : 3
    0x21 : 4
    0x22 : 5
    0x23 : 6
    0x24 : 7
    0x25 : 8
    0x26 : 9
    0x27 : 0
    0x28 : return
*/

let hidInputStr = ''
let hidInputEnd = false
device.on('data', data => {
    const newData = data
        .filter(val => val != 0x00)
        .map(val => {
            if (0x1d < val && val < 0x27) {
                return (val - 0x1d).toString(10)
            } else if (val == 0x27) {
                return (val - 0x27).toString(10)
            } else if (val == 0x28) {
                hidInputEnd = true
                return null
            }
        })
        .join('')
        .slice(0, -1)
    hidInputStr += newData
})

bot.event.discord.msg.on('message', async msg => {
    console.log(msg)
})