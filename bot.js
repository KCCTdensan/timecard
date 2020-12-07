const conf = require('./config.json')

const Discord = require('discord.js')
const d_client = new Discord.Client()

const { EventEmitter } = require('events')
const discordMsgEvent = new EventEmitter()

const sendMsg = async (text, channel = conf.bot.discord.channel) => {
    await d_client.channels.cache.get(channel).send(text)
}

d_client.on('message', msg => {
    if (msg.author.id === d_client.user.id) return
    discordMsgEvent.emit('message', msg)
})

d_client.login(conf.bot.discord.token)

module.exports = {
    event: {
        discord: discordMsgEvent
    },
    sendMsg
}
