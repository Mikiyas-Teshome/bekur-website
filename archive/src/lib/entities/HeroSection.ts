import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hero_sections')
export class HeroSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  headline: {
    main: string;
    highlight: string;
    ending: string;
    subtitle: string;
  };

  @Column('json')
  description: {
    mobile: string;
    desktop: string;
  };

  @Column('json')
  video: {
    thumbnail: string;
    alt: string;
    youtubeUrl: string;
  };

  @Column('json')
  clientSatisfaction: {
    count: string;
    label: string;
    avatars: Array<{
      image: string;
      name: string;
      fallback: string;
    }>;
  };

  @Column('json')
  socialPlatforms: Array<{ name: string; url: string }>;

  @Column('json')
  background: {
    image: string;
    size: string;
    position: string;
    repeat: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

