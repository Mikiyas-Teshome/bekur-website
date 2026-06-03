import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { getDataSource } from '../lib/db';
import { Service } from '../lib/entities/Service';
import { Company } from '../lib/entities/Company';
import { TeamMember } from '../lib/entities/TeamMember';
import { Testimonial } from '../lib/entities/Testimonial';
import { Feature } from '../lib/entities/Feature';
import { Value } from '../lib/entities/Value';
import { HeroSection } from '../lib/entities/HeroSection';
import { PricingPlan } from '../lib/entities/PricingPlan';

// Import JSON data
import servicesData from '../data/services.json';
import companiesData from '../data/companies.json';
import teamData from '../data/team.json';
import testimonialsData from '../data/testimonials.json';
import featuresData from '../data/features.json';
import valuesData from '../data/values.json';
import heroData from '../data/hero.json';

async function seedFromJson() {
  try {
    const dataSource = await getDataSource();
    
   // Clear existing data (only if tables exist)
    try {
      await dataSource.getRepository(Service).clear();
      await dataSource.getRepository(Company).clear();
      await dataSource.getRepository(TeamMember).clear();
      await dataSource.getRepository(Testimonial).clear();
      await dataSource.getRepository(Feature).clear();
      await dataSource.getRepository(Value).clear();
      await dataSource.getRepository(PricingPlan).clear();
      await dataSource.getRepository(HeroSection).clear();
    } catch  {
    }

    // Seed Services
    const serviceRepository = dataSource.getRepository(Service);
    for (const serviceData of servicesData.services) {
      const service = serviceRepository.create({
        title: serviceData.title,
        description: serviceData.description,
        iconKey: serviceData.iconKey,
        order: parseInt(serviceData.number) - 1, // Convert "01" to 0, "02" to 1, etc.
        steps: [] // Empty for now, will be populated later
      });
      await serviceRepository.save(service);
    }

    // Seed Companies
    const companyRepository = dataSource.getRepository(Company);
    for (const companyData of companiesData.companies) {
      const company = companyRepository.create({
        name: companyData.name,
        logo: companyData.logo,
        order: companyData.id - 1 // Use id as order
      });
      await companyRepository.save(company);
    }

    // Seed Team Members
    const teamRepository = dataSource.getRepository(TeamMember);
    for (const memberData of teamData.teamMembers) {
      const member = teamRepository.create({
        profileImage: memberData.profileImage,
        name: memberData.name,
        title: memberData.title,
        socialLinks: memberData.socialLinks,
        order: memberData.id - 1
      });
      await teamRepository.save(member);
    }

    // Seed Testimonials
    const testimonialRepository = dataSource.getRepository(Testimonial);
    for (const testimonialData of testimonialsData.testimonials) {
      const testimonial = testimonialRepository.create({
        profileImage: testimonialData.profileImage,
        username: testimonialData.username,
        description: testimonialData.description,
        joinedDate: testimonialData.joinedDate,
        order: testimonialData.id - 1
      });
      await testimonialRepository.save(testimonial);
    }

    // Seed Features
    const featureRepository = dataSource.getRepository(Feature);
    for (const featureData of featuresData.features) {
      const feature = featureRepository.create({
        title: featureData.title,
        description: featureData.description,
        order: featureData.id - 1
      });
      await featureRepository.save(feature);
    }

    // Seed Values
    const valueRepository = dataSource.getRepository(Value);
    for (const valueData of valuesData.values) {
      const value = valueRepository.create({
        title: valueData.title,
        description: valueData.description,
        step: valueData.step,
        iconKey: valueData.iconKey,
        order: valueData.id - 1
      });
      await valueRepository.save(value);
    }

    // Seed Hero Section
    const heroRepository = dataSource.getRepository(HeroSection);
    const hero = heroRepository.create({
      headline: heroData.hero.headline,
      description: heroData.hero.description,
      video: heroData.hero.video,
      clientSatisfaction: heroData.hero.clientSatisfaction,
      socialPlatforms: heroData.hero.socialPlatforms,
      background: heroData.hero.background
    });
    await heroRepository.save(hero);

    // Seed some sample pricing plans
    const pricingRepository = dataSource.getRepository(PricingPlan);
    const samplePricingPlans = [
      {
        name: 'Basic',
        price: '$99',
        period: 'monthly',
        features: ['Basic website', 'Email support', '5 pages'],
        highlight: false,
        order: 0,
        targetAudience: 'For Small Businesses',
        buttonText: 'Get Started'
      },
      {
        name: 'Pro',
        price: '$199',
        period: 'monthly',
        features: ['Advanced website', 'Priority support', 'Unlimited pages', 'SEO optimization'],
        highlight: true,
        order: 1,
        targetAudience: 'For Growing Companies',
        buttonText: 'Get Started'
      },
      {
        name: 'Enterprise',
        price: '$399',
        period: 'monthly',
        features: ['Custom solution', '24/7 support', 'Custom integrations', 'Advanced analytics'],
        highlight: false,
        order: 2,
        targetAudience: 'For Large Organizations',
        buttonText: 'Contact Sales'
      }
    ];

    for (const pricingData of samplePricingPlans) {
      const pricing = pricingRepository.create(pricingData);
      await pricingRepository.save(pricing);
    }

    
    // Close the connection
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedFromJson();
