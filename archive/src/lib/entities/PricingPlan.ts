import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum PricingType {
  SIMPLE = "simple",
  PLATFORM_BASED = "platform_based",
}

export enum Platform {
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  YOUTUBE = "youtube",
  GOOGLE = "google",
  GENERAL = "general",
}

@Entity("pricing_plans")
export class PricingPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column("json")
  features: string[];

  @Column({ default: false })
  highlight: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  serviceId: number;

  @Column({ nullable: true })
  originalPrice: string;

  @Column({ nullable: true })
  discount: string;

  @Column({ nullable: true })
  targetAudience: string;

  @Column({ nullable: true })
  buttonText: string;

  // New fields for platform-based pricing
  @Column({
    type: "enum",
    enum: PricingType,
    default: PricingType.SIMPLE,
  })
  pricingType: PricingType;

  @Column({
    type: "enum",
    enum: Platform,
    nullable: true,
  })
  platform: Platform;

  @Column({ nullable: true })
  subtitle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
