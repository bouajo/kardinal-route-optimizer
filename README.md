# Kardinal Route Optimizer

A web application for optimizing delivery routes using Excel file uploads, Flatfile for data mapping, and Kardinal API for route optimization.

## Features

- **Excel File Upload**: Upload your route data in Excel format (.xlsx, .xls)
- **Data Mapping with Flatfile**: Map your Excel columns to required fields
- **Route Optimization**: Optimize routes using the Kardinal API
- **Results Display**: View optimized routes in a clear, tabular format
- **Communication Options**: Send route information via SMS or WhatsApp

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd kardinal-route-optimizer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   The project is already configured with your API keys in next.config.js and .env.local.
   
   If you need to update settings, modify the `.env.local` file in the root directory:
   ```
   # Flatfile configuration
   NEXT_PUBLIC_FLATFILE_SECRET_KEY=sk_2bf550be40f2415b84bd069afbdd7b13

   # Kardinal API configuration
   KARDINAL_API_KEY=eyJhbGciOiJFUzM4NCJ9.eyJhdWQiOlsiYXBpIl0sImV4cCI6MTc1ODg4OTA2NywiaWF0IjoxNzQzMDc3ODY3LCJpc3MiOiJrYXJkaW5hbC5qd3QiLCJsZXZlbCI6ImFkbWluIiwibG9uZ1Rlcm0iOnRydWUsIm5iZiI6MTc0MzA3Nzg2Niwicm9sZSI6ImV4cGVydCIsInNjb3BlIjoiYWNjZXNzIiwic3ViIjoiam9uYXRoYW5fdG9rZW4ifQ.Rvwus1ueTYRCJdfKf4sdDoAZIzdfy-pZYd_2_bQDmQVwexw0cxDJUkK_TuGRKWMndDX81BiRbnJfqRhp0O876OQ4gIZqS_jPl2-BrQ6FMZ2x9enUBoiP6XNKpk73nWVD

   # Messaging service (if using Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Using Your Flatfile Integration

The application is configured with your Flatfile secret key. Here's how the integration works:

1. Upload an Excel file using the file uploader component
2. The application will send your data to Flatfile using your secret key
3. Flatfile's data mapping interface will open where you can map your columns
4. After mapping is complete, the data will be returned to the application
5. The optimized route will be calculated and displayed

### Customizing Flatfile Fields

You can customize the Flatfile field definitions in the `DataMapping.tsx` component. The current fields are:
- Location Name
- Address
- Latitude
- Longitude
- Time Window Start (optional)
- Time Window End (optional)
- Duration (optional)

## Kardinal API Integration

The application is integrated with the Kardinal Route Optimization API. Here's how it works:

### Authentication

The app uses JWT token-based authentication with the Kardinal API. Your JWT token is stored in the .env.local file and managed by the application.

### API Endpoints Used

1. **Route Optimization**
   - Endpoint: `POST /routes/optimize`
   - Purpose: Generates optimized routes based on the mapped data from Flatfile
   - Location: `app/api/optimize/route.ts`

2. **Territory Management**
   - Endpoints: 
     - `GET /territories`: Retrieves all territories
     - `POST /territories`: Creates a new territory
   - Location: `app/api/territories/route.ts`

3. **Route Details**
   - Endpoint: `GET /routes/{route_id}`
   - Purpose: Retrieves detailed information about a specific route
   - Location: `app/api/routes/[route_id]/route.ts`

### Kardinal API Documentation

For more details on the Kardinal API, refer to the official documentation at:
https://app.kardinal.ai/api/v2/doc/openapi.html

## Messaging Integration

This application supports sending route information via SMS and WhatsApp using services like Twilio.

1. Configure your Twilio credentials in the `.env.local` file
2. Uncomment the Twilio integration code in the API routes for SMS and WhatsApp

## Technical Implementation Details

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Flatfile SDK for data mapping
- Kardinal API for route optimization
- Twilio (optional) for SMS and WhatsApp messaging

## Project Structure

- `app/components/`: React components for the UI
- `app/api/`: API routes for backend functionality
- `app/utils/`: Utility functions for API integration
- `app/page.tsx`: Main application page

## License

[MIT](LICENSE) 