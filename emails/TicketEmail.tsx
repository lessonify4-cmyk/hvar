import {
  Body,
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
import { format } from 'date-fns'

interface TicketEmailProps {
  eventName: string
  date: Date
  time: string
  location: string
  address?: string | null
  qrCode: string
  quantity: number
}

export const TicketEmail = ({
  eventName = 'Hvar Summer Festival',
  date = new Date(),
  time = '20:00',
  location = 'Hvar Town Square',
  address = 'Trg sv. Stjepana, Hvar',
  qrCode = 'HL-123456789',
  quantity = 1,
}: TicketEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your ticket for {eventName}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Heading className="text-[#0B5E8A] text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-serif">
              HvarLive
            </Heading>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your booking is confirmed! 🎉
            </Heading>
            
            <Section className="bg-blue-50 p-[20px] rounded-lg mb-[30px]">
              <Text className="text-black text-[18px] font-bold m-0 mb-[10px]">
                {eventName}
              </Text>
              <Text className="text-gray-700 m-0 mb-[5px]">
                <strong>Date:</strong> {format(date, 'MMMM d, yyyy')}
              </Text>
              <Text className="text-gray-700 m-0 mb-[5px]">
                <strong>Time:</strong> {time}
              </Text>
              <Text className="text-gray-700 m-0 mb-[5px]">
                <strong>Location:</strong> {location}
              </Text>
              {address && (
                <Text className="text-gray-700 m-0 mb-[5px]">
                  <strong>Address:</strong> {address}
                </Text>
              )}
              <Text className="text-gray-700 m-0">
                <strong>Quantity:</strong> {quantity} ticket{quantity > 1 ? 's' : ''}
              </Text>
            </Section>

            <Section className="text-center mb-[30px]">
              <Text className="text-gray-600 mb-[10px]">
                Show this code at the entrance
              </Text>
              <div className="bg-gray-100 p-4 inline-block rounded border border-gray-300">
                <Text className="text-[24px] font-mono font-bold tracking-widest m-0 text-black">
                  {qrCode}
                </Text>
              </div>
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

export default TicketEmail
