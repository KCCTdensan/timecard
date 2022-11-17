import { HID } from "node-hid"
import { EventEmitter } from "node:events"

export const hidev = new EventEmitter()

export default function initdev(...args) {
  const hid = new HID(...args)
  hid.on("data", handler)
  return hidev
}

let buf = ""
function handler(data) {
  for (const c of data) {
    switch (true) {
      case 0x1e <= c && c <= 0x26:
        buf += c - 0x1d
        break
      case c == 0x27:
        buf += 0
        break
      case c == 0x28:
        hidev.emit("submit", buf)
        buf = ""
        break
    }
  }
}

/*
  CODE : KEY
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
