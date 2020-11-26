const conf = require('./config.json')
const classes = require('./classes')
const Db = require('./db')
const bot = require('./bot')
const hid = require('./hid')

const db = new Db.Sqlite(conf.db.dbFile)

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

hid.event.scanner.on('input', async inputStr => {
    console.log(`scanner: ${inputStr}`)
    try {
        const user = await db.getUser({id: inputStr})
        const status = new classes.userStatus(user)
        await bot.sendMsg(`${user.course}科の${user.name}が${status.inRoom ? '入室' : '退室'}しました`)
    } catch(err) {
        const user = new classes.user({
            id: inputStr,
            name: 'Unknown',
            course: 'Unknown'
        })
        const status = new classes.userStatus(user)
        await bot.sendMsg(`データベースに登録されていないユーザー(\`${inputStr}\`)が${status.inRoom ? '入室': '退室'}しました`)
    }
})

const cIsMsgAuthorInTheRole => msg => async roleId => {
    for (const [ , role ] of (await msg.guild.roles.fetch()).cache()) {
        if (role.id == roleId) {
            for (const [ id, ] of (await role.members)) {
                if (msg.author.id == roleId) {
                    return true
                }
            }
        }
    }
    return false
}
const cGetCmdArg = text => cmdName =>
    text.startsWith(cmdName) ?
    text.replace((text.match(new RegExp(`^${cmdName}\\ +`)) || [])[0] || cmdName, '') :
    false

bot.event.discord.on('message', async msg => {
    console.log(`discord: ${msg.content}`)
    if (! msg.content) return


    const isRoleMember = cIsMsgAuthorInTheRole(msg)
    const getArg = cGetCmdArg(msg.content)
    const ifArgExists = async (arg, func) => {
        if (! arg) {
            await bot.sendMsg('有効な引数が見つかりません。コマンドの使用方法は`/help`で確認できます。')
        } else {
            return await func(arg)
        }
    }

    switch (true) {

        case /^\/help.*$/.test(msg.content):
            bot.sendMsg('未実装。申し訳無い')

        case msg.content.startsWith('/updateUserJson'):
            if (! (await isRoleMember(conf.bot.discord.roles.admin))) {
                await bot.sendMsg('あなたはこの操作を行う権限がありません。サーバーの管理者に連絡してください。')
                break
            }
            ifArgExists(getArg('/updateUserJson'), async arg => {
                try {
                    const newUserInfo = JSON.parse(arg)
                    try {
                        const newUser = new classes.user(newUserInfo)
                        try {
                            try {
                                const user = await db.addUser(newUser)
                                await bot.sendMsg(`\`${user.id}\`を${user.course}科の${user.name}として登録しました`)
                            } catch(err) {
                                const user = await db.updateUser(newUser)
                                await bot.sendMsg(`\`${user.id}\`を${user.course}科の${user.name}として更新しました`)
                            }
                        } catch(err) {
                            await bot.sendMsg('サーバーでエラーが発生しました')
                        }
                    } catch(err) {
                        await bot.sendMsg('不正なフォーマットです。ユーザー情報を構築できませんでした。')
                    }
                } catch(err) {
                    await bot.sendMsg('JSON解析エラーです。文法が間違っている可能性があります(※連想配列のキー名もダブルクォーテーションで囲う必要があります)')
                }
            })
            break
    }
})
