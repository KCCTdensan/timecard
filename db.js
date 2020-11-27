const sqlite = require('sqlite3').verbose()
const classes = require('./classes')
const rndHex = require('./rndHex')

const userTable = 'person'
const statusTable = 'status'

class Sqlite {
    constructor(dbFilePath) {
        if (! dbFilePath) throw 'The database file path is not valid.'
        try {
            this.db = new sqlite.Database(dbFilePath)
            const db = this.db
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS ${userTable}(id INTEGER UNIQUE, name TEXT, course TEXT)`)
                db.run(`CREATE TABLE IF NOT EXISTS ${statusTable}(d_id TEXT UNIQUE, prev_d_id TEXT, id INTEGER, updated TEXT, in_room INTEGER)`)
            })
        } catch(err) {
            throw err
        }
    }
    asyncSqlMethod = func => {
        const db = this.db
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                func(db, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                })
            })
        })
    }
    run(sql, values=[]) {
        return this.asyncSqlMethod((db, callback) => {
            db.run(sql, values, callback)
        })
    }
    get(sql, values=[]) {
        return this.asyncSqlMethod((db, callback) => {
            db.get(sql, values, callback)
        })
    }
    all(sql, values=[]) {
        return this.asyncSqlMethod((db, callback) => {
            db.all(sql, values, callback)
        })
    }
    close() {
        this.db.close()
    }
    async getUser({ id }) {
        if (! id) throw 'User id is not valid.'
        const row = await this.get(`SELECT * FROM ${userTable} WHERE id=?`, id)
        if (row) {
            return new classes.user(row)
        } else {
            return null
        }
    }
    async updateUser(user) {
        const keys = []
        const values = {}
        if (! user.id) {
            throw 'User id is not valid.'
        } else {
            keys.push('id')
            values['$id'] = user.id
        }
        if (user.name) {
            keys.push('name')
            values['$name'] = user.name
        }
        if (user.course) {
            keys.push('course')
            values['$course'] = user.course
        }
        await this.run(`INSERT OR REPLACE INTO ${userTable}(${keys.join(',')}) VALUES($${keys.join(',$')})`, values)
        await this.updateStatus(user)
        return new classes.user(user)
    }
    async addUser(user) {
        if (await this.getUser(user)) throw 'The user exists.'
        return await this.updateUser(user)
    }
    async getStatus({ id }) {
        if (! id) throw 'User id is not valid.'
        const row = await this.get(`SELECT * FROM ${statusTable} WHERE id=?`, id)
        if (row) {
            return new classes.userStatus({
                updated = new Date(row.updated),
                inRoom = row.in_room == 1 ? true : false
            })
        } else {
            return null
        }
    }
    async updateStatus(user) {
        const keys = []
        const values = {}
        if (! user.id) {
            throw 'User id is not valid.'
        } else {
            keys.push('id')
            values['$id'] = user.id
        }
        if (! user.status.updated) {
            throw 'Status updated date is not valid.'
        } else {
            keys.push('updated')
            values['$updated'] = user.status.updated
        }
        if (user.status.inRoom === true) {
            keys.push('in_room')
            values['$in_room'] = 1
        } else if (user.status.inRoom === false) {
            keys.push('in_room')
            values['$in_room'] = 0
        }
        keys.push('d_id')
        values['$d_id'] = (() => {
            while (true) {
                const hex = rndHex(6)
                if (! (await this.get(`SELECT d_id FROM ${statusTable} WHERE d_id=?`, hex))) return hex
            }
        })()
        const prevRow = await this.get(`SELECT * FROM ${statusTable} WHERE id=?`, user.id)
        if (prevRow) {
            keys.push('prev_d_id')
            values['$prev_d_id'] = prevRow.d_id
        }
        await this.run(`INSERT OR REPLACE INTO ${statusTable}(${keys.join(',')}) VALUES($${keys.join(',$')})`, values)
        return new classes.user(user)
    }
}

module.exports = { Sqlite }
