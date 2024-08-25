import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { data, folderName } = await req.json();
    
    // Set the folder name where the file will be uploaded.
    // If the folder doesn't exist, Cloudinary will create it automatically.
    const folderPath = folderName ? folderName : 'default_folder';

    const uploadedResponse = await cloudinary.uploader.upload(data, {
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      folder: folderPath,
    });

    return NextResponse.json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}
