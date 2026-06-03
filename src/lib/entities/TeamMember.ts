import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileImage: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column('json')
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

