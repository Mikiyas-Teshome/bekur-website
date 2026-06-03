import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  iconKey: string;

  @Column({ default: 0 })
  order: number;

  @Column('json', { nullable: true })
  steps: Record<string, unknown>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateNumber() {
    if (this.order !== undefined) {
      this.number = String(this.order + 1).padStart(2, '0');
    }
  }
}

