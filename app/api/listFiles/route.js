import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folderName = searchParams.get('folderName') || 'default_folder';

    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderName,  
    });

    return NextResponse.json({ files: resources.resources });
  } catch (error) {
    console.error('Error fetching files from Cloudinary:', error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}
