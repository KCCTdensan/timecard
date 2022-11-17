class userStatus {
  constructor(status) {
    if (status) {
      this.inRoom = status.inRoom === true ? true : false
      this.updated = status.updated || new Date()
    } else {
      this.inRoom = false
      this.updated = new Date()
    }
  }

  update(info) {
    if (info.inRoom === true || info.inRoom === false) this.inRoom = info.inRoom
    this.updated = new Date()
    return this
  }

  toggleInRoom() {
    return this.update({ inRoom: this.inRoom ? false : true })
  }
}

class user {
  constructor(...info) {
    let id, name, course

    if (Array.isArray(info[0])) {
      id = info[0][0]
      name = info[0][1]
      course = info[0][2]
    } else if (typeof info[0] === "object") {
      id = info[0].id
      name = info[0].name
      course = info[0].course
    } else {
      id = info[0]
      name = info[1]
      course = info[2]
    }

    if (!/^[0-9]{6}$/.test(id)) throw "User id is not valid."

    if (id && name && course) {
      this.id = id
      this.name = name
      this.course = course
      this.status = new userStatus()
    } else {
      throw "There are missing part(s)."
    }
  }

  setStatus(status) {
    if (status) {
      this.status = new userStatus(status)
      return this
    } else {
      throw "There are missing part(s)."
    }
  }
}

module.exports = { user, userStatus }
