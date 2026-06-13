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

interface EventApprovedEmailProps {
  eventTitle: string
  eventSlug: string
  eventDate: string
}

export const EventApprovedEmail = ({ 
  eventTitle = 'Summer Beach Party',
  eventSlug = 'summer-beach-party',
  eventDate = '2026-07-15'
}: EventApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your event has been approved!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Heading className="text-[#0B5E8A] text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-serif">
              HvarLive
            </Heading>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
              Your event is live! 🎉
            </Heading>
            
            <Text className="text-gray-700 text-[16px] leading-[24px] text-center">
              Great news! Your event <strong>"{eventTitle}"</strong> on {eventDate} has been approved by our team and is now live on HvarLive.
            </Text>

            <Section className="my-[30px] bg-green-50 border border-green-200 p-6 rounded-lg text-center">
              <Text className="text-black text-[16px] m-0 mb-[10px]">
                Tip: Share this link on your social media to boost ticket sales!
              </Text>
              <Text className="text-[#0B5E8A] font-medium m-0 underline">
                {process.env.NEXT_PUBLIC_APP_URL}/events/{eventSlug}
              </Text>
            </Section>

            <Section className="text-center my-[30px]">
              <Button 
                href={`${process.env.NEXT_PUBLIC_APP_URL}/events/${eventSlug}`} 
                className="bg-[#0B5E8A] rounded text-white text-[16px] font-semibold no-underline text-center px-6 py-3"
              >
                View Your Event
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

export default EventApprovedEmail
