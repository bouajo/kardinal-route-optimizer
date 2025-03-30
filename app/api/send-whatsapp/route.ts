import { NextResponse } from 'next/server';

// Replace with your actual WhatsApp service credentials
// For example, using Twilio for WhatsApp:
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

    // Format the route information for WhatsApp
    let messageText = '*Your Optimized Route*\n\n';
    
    if (Array.isArray(routes)) {
      routes.forEach((route, index) => {
        messageText += `*${index + 1}.* ${route.location || 'Stop'}: ${route.address || 'N/A'}\n`;
        if (route.estimatedTime) {
          messageText += `   _Estimated time:_ ${route.estimatedTime}\n`;
        }
        messageText += '\n';
      });
    } else {
      messageText += 'No route information available';
    }

    // In a real implementation, you would call your WhatsApp service API here
    // For example, with Twilio:
    /*
    const message = await client.messages.create({
      body: messageText,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });

    return NextResponse.json({
      success: true,
      messageId: message.sid
    });
    */

    // Mock response for demonstration
    console.log('Would send WhatsApp to:', to);
    console.log('Message content:', messageText);

    return NextResponse.json({
      success: true,
      messageId: 'mock-whatsapp-message-id-' + Date.now()
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send WhatsApp message',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 