const conf = require('./config.json')
const baseClasses = require('./baseClasses')
const Db = require('./db')
const bot = require('./bot')
const hid = require('./hid')

const db = new Db.Sqlite(conf.db.dbFile)

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

hid.event.scanner.on('input', async inputStr => {
    console.log(`scanner: ${inputStr}`)
    try {
        const user = await db.getUser({id: inputStr})
        const status = new baseClasses.userStatus(user)
        await bot.sendMsg(`${user.course}科の${user.name}が${status.inRoom ? '入室' : '退室'}しました`)
    } catch(err) {
        const user = new baseClasses.user({
            id: inputStr,
            name: 'Unknown',
            course: 'Unknown'
        })
        const status = new baseClasses.userStatus(user)
        await bot.sendMsg(`データベースに登録されていないユーザー(\`${inputStr}\`)が${status.inRoom ? '入室': '退室'}しました`)
    }
})

bot.event.discord.on('message', async msg => {
    console.log(`message: ${msg.content}`)
    try {
        const userInfo = JSON.parse(msg.content.replace(msg.content.match(/^\/addUser\ +/), ''))
        try {
            const user = await db.addUser(userInfo)
            await bot.sendMsg(`\`${user.id}\`を${user.course}科の${user.name}として登録しました`)
        } catch(err) {
            await bot.sendMsg('サーバーでエラーが発生しました')
        }
    } catch(err) {
        await bot.sendMsg('JSON解析エラーです。文法が間違っている可能性があります(※連想配列のキー名もダブルクォーテーションで囲う必要があります)')
    }
})
