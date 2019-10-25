import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn({ name: "actor_id" })
  id: number;

  @Column({name: "first_name", type: "varchar", length: 200})
  firstName: string;

  @Column({name: "last_name", type: "varchar", length: 200})
  lastName: string;

  @Column({name: "last_update", type: "timestamp"})
  lastUpdate: Date;
}