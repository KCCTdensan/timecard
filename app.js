const HID = require('node-hid')
const conf = require('./config.json')
const baseClasses = require('./baseClasses')
const Db = require('./db')
const bot = require('./bot')

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

device.on('data', data => {

    console.log(data,

    data.toString('hex')
        .match(/.{2}/g)
        .filter(val => ! val === 0x00)
        .map(val => switch (val) {
            // if (0x1e =< val =< 0x27) return val-0x1d
            case 0x1e: return 1
            case 0x1f: return 2
            case 0x20: return 3
            case 0x21: return 4
            case 0x22: return 5
            case 0x23: return 6
            case 0x24: return 7
            case 0x25: return 8
            case 0x26: return 9
            case 0x27: return 0
            case 0x28: return
            default: return 0
        })
        .join('')

    )

})

bot.event.discord.msg.on('message', async msg => {
    console.log(msg)
})