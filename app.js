const conf = require('./config.json')
const baseClasses = require('./baseClasses')
const Db = require('./db')
const bot = require('./bot')
const hid = require('./hid')

const db = new Db.Sqlite(conf.db.dbFile)
const device = new HID.HID(conf.scanner.path)

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

hid.event.scanner.on('input', async inputStr => {
    console.log(inputStr)
})

bot.event.discord.on('message', async msg => {
    console.log(msg)
})
