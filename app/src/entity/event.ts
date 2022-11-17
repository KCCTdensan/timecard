import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user: number

  @Column()
  updated: Date

  @Column
  status: enum //
}
