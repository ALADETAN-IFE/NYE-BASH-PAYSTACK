import 'dotenv/config'
import { connectToDatabase } from '@/lib/db'
import Event from '@/model/Event'
import { events } from '@/lib/events-data'
import { uploadToCloudinary } from '@/lib/cloudinary-server'
import * as fs from 'fs'
import * as path from 'path'

async function seedEvents() {
  try {
    console.log('Connecting to database...')
    await connectToDatabase()

    console.log('Clearing existing events...')
    await Event.deleteMany({})

    console.log('Seeding events with images...')
    for (const event of events) {
      let imageUrl = event.image
      let cloudinaryPublicId: string | undefined

      // Check if image is a local file path
      if (event.image.startsWith('/')) {
        const imagePath = path.join(process.cwd(), 'public', event.image)
        
        if (fs.existsSync(imagePath)) {
          try {
            console.log(`  Uploading image for: ${event.title}`)
            
            // Read the file and convert to base64
            const imageBuffer = fs.readFileSync(imagePath)
            const base64Image = imageBuffer.toString('base64')
            const mimeType = event.image.endsWith('.png') ? 'image/png' : 'image/jpeg'
            const base64String = `data:${mimeType};base64,${base64Image}`
            
            // Upload to Cloudinary
            const uploadResult = await uploadToCloudinary(base64String, 'nye-bash/events')
            imageUrl = uploadResult.secure_url
            cloudinaryPublicId = uploadResult.public_id
            
            console.log(`  ✓ Image uploaded: ${event.title}`)
          } catch (uploadError) {
            console.error(`  ✗ Failed to upload image for ${event.title}:`, uploadError)
          }
        } else {
          console.log(`  ⚠ Image file not found for ${event.title}: ${imagePath}`)
        }
      }

      await Event.create({
        ...event,
        image: imageUrl,
        cloudinaryPublicId,
      })
      console.log(`✓ Created event: ${event.title}`)
    }

    console.log(`\n✅ Successfully seeded ${events.length} events to the database!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding events:', error)
    process.exit(1)
  }
}

seedEvents()
