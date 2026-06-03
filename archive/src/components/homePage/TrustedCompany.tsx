"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import companiesData from "@/data/companies.json"

interface Company {
  id: number
  name: string
  logo: string
  darkLogo?: string
}

interface InfiniteScrollProps {
  companies: Company[]
  speed?: number
  className?: string
}

const InfiniteScroll = ({ companies, speed = 20, className = "" }: InfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  // Create multiple copies for seamless loop
  const duplicatedCompanies = [...companies, ...companies, ...companies]

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return

    const container = containerRef.current
    const scrollElement = scrollRef.current

    // Set initial position
    gsap.set(scrollElement, { x: 0 })

    // Calculate the width of one set of companies
    const singleSetWidth = scrollElement.scrollWidth / 3

    // Create smooth infinite animation
    const tl = gsap.timeline({ repeat: -1 })

    tl.to(scrollElement, {
      x: -singleSetWidth,
      duration: speed,
      ease: "none"
    })

    animationRef.current = tl

    // Add fade effects using CSS masks
    container.style.maskImage = `linear-gradient(to right, 
      transparent 0%, 
      black 5%, 
      black 95%, 
      transparent 100%)`
    container.style.webkitMaskImage = `linear-gradient(to right, 
      transparent 0%, 
      black 5%, 
      black 95%, 
      transparent 100%)`

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [speed])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap relative ${className}`}
    >
      <div
        ref={scrollRef}
        className="inline-flex items-center gap-8 md:gap-12 lg:gap-16"
      >
        {duplicatedCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex items-center justify-center shrink-0 transition-all duration-500 hover:scale-110"
          >
            {/* Light mode */}
            <Image
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={140}
              height={42}
              className="object-contain w-24 h-8 sm:w-28 sm:h-9 md:w-32 md:h-10 lg:w-36 lg:h-11 xl:w-[140px] xl:h-[42px] transition-all duration-500 block dark:hidden"
              priority={index < companies.length}
            />
            {/* Dark mode (fallback to light) */}
            <Image
              src={company.darkLogo || company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={140}
              height={42}
              className="object-contain w-24 h-8 sm:w-28 sm:h-9 md:w-32 md:h-10 lg:w-36 lg:h-11 xl:w-[140px] xl:h-[42px] transition-all duration-500 hidden dark:block"
              priority={index < companies.length}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const TrustedCompany = () => {
  return (
    <div className="w-full">
      <InfiniteScroll
        companies={companiesData.companies}
        speed={25}
        className="w-full"
      />
    </div>
  )
}

export default TrustedCompany
