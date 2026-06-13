import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  userName: string
}

export const WelcomeEmail = ({ userName = 'there' }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to HvarLive!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Heading className="text-[#0B5E8A] text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-serif">
              HvarLive
            </Heading>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
              Welcome to HvarLive, {userName}! 🌊
            </Heading>
            
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              We're thrilled to have you here. HvarLive is your premium portal for everything happening on our beautiful island.
            </Text>

            <Section className="my-[30px] bg-blue-50 p-6 rounded-lg">
              <Text className="text-black text-[18px] font-bold m-0 mb-[10px]">
                Quick Start Tips:
              </Text>
              <Text className="text-gray-700 m-0 mb-[10px] pl-4 border-l-2 border-[#0B5E8A]">
                <strong>Browse Events:</strong> Find concerts, sports, culture, and more.
              </Text>
              <Text className="text-gray-700 m-0 mb-[10px] pl-4 border-l-2 border-[#0B5E8A]">
                <strong>Save Favorites:</strong> Click the heart on any event to save it for later.
              </Text>
              <Text className="text-gray-700 m-0 pl-4 border-l-2 border-[#0B5E8A]">
                <strong>Add an Event:</strong> Become an organizer and post your own events.
              </Text>
            </Section>

            <Section className="text-center my-[30px]">
              <Button 
                href={process.env.NEXT_PUBLIC_APP_URL || 'https://hvarlive.com'} 
                className="bg-[#0B5E8A] rounded text-white text-[16px] font-semibold no-underline text-center px-6 py-3"
              >
                Browse Events
              </Button>
            </Section>

            <Text className="text-gray-500 text-[12px] text-center mt-[40px]">
              If you have any questions, please reply to this email. <br/>
              &copy; {new Date().getFullYear()} HvarLive. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WelcomeEmail
