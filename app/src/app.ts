import { devices } from "node-hid"

import { AppDataSource } from "db"
import { hidev, initdev } from "hid"

const paths = process.env.HID?.split(",") ?? devices().map(i => i.path)

hidev.on("submit", (code: string) => {
  console.log(`scanner: ${inputStr}`)
  try {
    const user = await db.getUser({ id: inputStr })
    const lastStatus = await db.getLatestStatus(user)
    if (lastStatus && Date.now() - lastStatus.updated.getTime() < 10000) return
    user.status.toggleInRoom()
    await db.updateUserStatus(user)
    if (user.status.inRoom) {
      await bot.sendMsg(
        `[${user.status.updated.toLocaleString("ja")}] \`${
          user.course
        }\`科の\`${user.name}\`が入室しました`
      )
    } else {
      await bot.sendMsg(
        `[${user.status.updated.toLocaleString("ja")}] \`${
          user.course
        }\`科の\`${user.name}\`が退室しました (${
          Math.round(
            ((user.status.updated - lastStatus.updated) * 100) / 60000
          ) / 100
        }分)`
      )
    }
  } catch (err) {
    console.error(err)
    await bot.sendMsg(
      `[${new Date().toLocaleString(
        "ja"
      )}] データベースに登録されていないユーザー(\`${inputStr}\`)が出入りしました`
    )
  }
})

paths.forEach(initdev)

////////////////////////////////////////////////////////////////

const cIsMsgAuthorInTheRole = msg => async roleId => {
  for (const [, role] of (await msg.guild.roles.fetch()).cache) {
    if (role.id == roleId) {
      for (const [id] of await role.members) {
        if (msg.author.id == id) {
          return true
        }
      }
    }
  }
  return false
}

const cGetCmdArg = text => cmdName =>
  text.startsWith(cmdName)
    ? text.replace(
        (text.match(new RegExp(`^${cmdName}\\ +`)) || [])[0] || cmdName,
        ""
      )
    : false

bot.event.discord.on("message", async msg => {
  console.log(`discord: ${msg.content}`)
  if (!msg.content) return

  const isAuthorInRole = cIsMsgAuthorInTheRole(msg)
  const getArg = cGetCmdArg(msg.content)
  const ifArgExists = async (arg, func) => {
    if (!arg) {
      await bot.sendMsg(
        "有効な引数が見つかりません。コマンドの使用方法は`/help`で確認できます。"
      )
    } else {
      return await func(arg)
    }
  }

  switch (true) {
    case /^\/help.*$/.test(msg.content):
      bot.sendMsg("未実装。申し訳無い")
      break

    case msg.content.startsWith("/updateUserJson"):
      if (!(await isAuthorInRole(conf.bot.discord.roles.admin))) {
        await bot.sendMsg(
          "あなたはこの操作を行う権限がありません。サーバーの管理者に連絡してください。"
        )
        break
      }
      ifArgExists(getArg("/updateUserJson"), async arg => {
        try {
          const newUserInfo = JSON.parse(arg)
          try {
            const newUser = new User(newUserInfo)
            try {
              try {
                const user = await db.addUser(newUser)
                await bot.sendMsg(
                  `\`${user.id}\`を${user.course}科の${user.name}として登録しました`
                )
              } catch (err) {
                const user = await db.updateUser(newUser)
                await bot.sendMsg(
                  `\`${user.id}\`を${user.course}科の${user.name}として更新しました`
                )
              }
            } catch (err) {
              await bot.sendMsg(
                `サーバーでエラーが発生しました:\n\`\`\` ${err} \`\`\``
              )
            }
          } catch (err) {
            await bot.sendMsg(
              "不正なフォーマットです。ユーザー情報を構築できませんでした。"
            )
          }
        } catch (err) {
          await bot.sendMsg(
            "JSON構文エラーです。文法が間違っています(※数値以外の値はダブルクォーテーションで囲う必要があります)"
          )
        }
      })
      break
  }
})
