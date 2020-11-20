const conf = require('./config.json')

const HID = require('node-hid')

const { EventEmitter } = require("events")
const hidInputEvent = new EventEmitter()

const device = new HID.HID(conf.scanner.path)

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
    hidInputStr += data
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

    if (hidInputEnd) {
        hidInputStr = hidInputStr.slice(0, -1)
        hidInputEvent.emit('input', hidInputStr)
        hidInputStr = ''
        hidInputEnd = false
    }
})

module.exports = {
    event: {
        scanner: hidInputEvent
    }
}
