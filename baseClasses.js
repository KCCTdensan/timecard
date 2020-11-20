class user {
    constructor(...info) {
        let id, name, course
        if (typeof info[0] === 'object') {
            id = info[0].id
            name = info[0].name
            course = info[0].course
        } else {
            id = info[0]
            name = info[1]
            course = info[2]
        }
        if (! id) throw 'User id is not valid.'
        if (id && name && course) {
            this.id = id
            this.name = name
            this.course = course
        } else {
            throw 'There are missing part(s).'
        }
    }
}

class userStatus {
    constructor(info) {
        this.user = new user(info)
        this.inRoom = false
        this.updated = new Date()
    }
    // update() {}
}

module.exports = { user, userStatus }