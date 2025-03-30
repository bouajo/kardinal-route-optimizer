import { NextResponse } from 'next/server';

// Replace with your actual SMS service credentials
// For example, using Twilio:
// import twilio from 'twilio';
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request: Request) {
  try {
    const { to, routes } = await request.json();

    if (!to || !routes) {
      return NextResponse.json(
        { error: 'Missing required fields: to and routes' },
        { status: 400 }
      );
    }

    // Format the route information for SMS
    let messageText = 'Your optimized route:\n\n';
    
    if (Array.isArray(routes)) {
      routes.forEach((route, index) => {
        messageText += `${index + 1}. ${route.location || 'Stop'}: ${route.address || 'N/A'}\n`;
        if (route.estimatedTime) {
          messageText += `   Estimated time: ${route.estimatedTime}\n`;
        }
        messageText += '\n';
      });
    } else {
      messageText += 'No route information available';
    }

    // In a real implementation, you would call your SMS service API here
    // For example, with Twilio:
    /*
    const message = await client.messages.create({
      body: messageText,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    return NextResponse.json({
      success: true,
      messageId: message.sid
    });
    */

    // Mock response for demonstration
    console.log('Would send SMS to:', to);
    console.log('Message content:', messageText);

    return NextResponse.json({
      success: true,
      messageId: 'mock-message-id-' + Date.now()
    });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send SMS',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 