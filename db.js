const sqlite = require('sqlite3').verbose()
const classes = require('./classes')

const userTable = 'person'
const statusTable = 'status'

class Sqlite {
    constructor(dbFilePath) {
        if (! dbFilePath) throw 'The database file path is not valid.'
        try {
            this.db = new sqlite.Database(dbFilePath)
            const db = this.db
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS ${userTable}(id INTEGER, name TEXT, course TEXT)`)
                db.run(`CREATE TABLE IF NOT EXISTS ${statusTable}(id INTEGER, status INTEGER, prev_status INTEGER, date TEXT)`)
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
    async updateUserDb(user) {
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
        return new classes.user(user)
    }
    async addUser(user) {
        if (await this.getUser(user)) throw 'The user exists.'
        return await this.updateUserDb(user)
    }
    async updateUser(user) {
        if (! await this.getUser(user)) throw 'The user does not exists.'
        return await this.updateUserDb(user)
    }
    async updateStatus(user, newStatus) {
        if (! await this.getUser(user)) throw 'The user does not exists.'
        return 
    }
    cUpdateStatus(user) {
        return async newStatus => await this.updateStatus(user, newStatus)
    }
}

module.exports = { Sqlite }
