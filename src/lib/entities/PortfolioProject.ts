import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('portfolio_projects')
export class PortfolioProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('json')
  content: Record<string, unknown>;

  @Column('text', { nullable: true })
  html: string;

  @Column('json', { nullable: true })
  gallery: string[];

  @Column('json', { nullable: true })
  tags: string[];

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

