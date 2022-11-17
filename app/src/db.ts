import { DataSource } from "typeorm"
import { User } from "entry/user"
import { Event } from "entry/event"

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_FILE ?? "app.db",
  synchronize: true,
  entities: [User, Event],
})
