# Google Maps API Setup Instructions

## Step 1: Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**

## Step 2: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the generated API key

## Step 3: Configure Environment Variable

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your real API key.

## Step 4: Secure Your API Key (Optional but Recommended)

1. In Google Cloud Console, go to **Credentials**
2. Click on your API key to edit it
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your domain (e.g., `localhost:3000/*` for development)

## Step 5: Restart Development Server

After adding the API key to `.env.local`, restart your development server:

```bash
npm run dev
```

## Troubleshooting

- **"Map requires API key"**: The API key is not set or invalid
- **"Oops something is wrong"**: The API key might be restricted or the required APIs aren't enabled
- **Blank map**: Check browser console for specific error messages

## Cost Considerations

- Google Maps has a free tier with $200 monthly credit
- For demo purposes, the usage should be well within free limits
- Consider setting up billing alerts in Google Cloud Console

## File Locations

- Environment file: `.env.local` (create in project root)
- Component using maps: `components/features/demo/DenverHomeLocation.tsx`
