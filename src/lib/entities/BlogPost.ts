import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  excerpt: string;

  @Column('json')
  content: Record<string, unknown>;

  @Column('text', { nullable: true })
  html: string;

  @Column({ type: 'varchar', nullable: true })
  featuredImage: string | null;

  @Column('json', { nullable: true })
  tags: string[];

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

