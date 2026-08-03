const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';
const datasetPath = path.join(__dirname, 'exercises.json');
const cloudinaryConfigured = Boolean(process.env.CLOUDINARY_URL && !String(process.env.CLOUDINARY_URL).includes('placeholder'));

if (cloudinaryConfigured) {
  cloudinary.config({ secure: true });
}

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['compound', 'isolation', 'cardio', 'flexibility', 'plyometric'], required: true },
  primaryMuscles: [{ type: String, required: true }],
  secondaryMuscles: [{ type: String }],
  equipment: [{ type: String }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  instructions: [{ type: String }],
  imageUrls: [{ type: String }],
  source: { type: String, default: 'seeded' },
  isCustom: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

const categoryMap = {
  strength: 'compound',
  powerlifting: 'compound',
  stretching: 'flexibility',
  cardio: 'cardio',
  plyometrics: 'plyometric',
  olympic_weightlifting: 'compound',
};

const difficultyMap = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

const equipmentMap = {
  'body only': 'bodyweight',
  'barbell': 'barbell',
  'dumbbells': 'dumbbells',
  'cable': 'cable',
  'machine': 'machine',
  'bench': 'bench',
  'kettlebells': 'kettlebells',
  'bands': 'bands',
  'medicine ball': 'medicine ball',
  'pull-up bar': 'pull-up bar',
  'rope': 'rope',
  'stability ball': 'stability ball',
  'foam roll': 'foam roller',
};

const normalizeEquipment = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => equipmentMap[entry.toLowerCase()] || entry.toLowerCase());
};

const normalizeCategory = (value) => {
  if (!value) return 'compound';
  return categoryMap[String(value).toLowerCase()] || 'compound';
};

const normalizeDifficulty = (value) => {
  if (!value) return 'intermediate';
  const lower = String(value).toLowerCase();
  return difficultyMap[lower] || 'intermediate';
};

const slugify = (value) => String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const downloadBuffer = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? https : http;
  client.get(url, (response) => {
    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      resolve(downloadBuffer(response.headers.location));
      return;
    }

    if (response.statusCode !== 200) {
      reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      return;
    }

    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => resolve(Buffer.concat(chunks)));
  }).on('error', reject);
});

const uploadImageToCloudinary = async (imageUrl, exerciseName) => {
  if (!cloudinaryConfigured) {
    return imageUrl;
  }

  try {
    const buffer = await downloadBuffer(imageUrl);
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: slugify(`${exerciseName}-${path.basename(new URL(imageUrl).pathname)}`),
          folder: 'fitforge/exercises',
          resource_type: 'image',
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );

      uploadStream.end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.warn(`Cloudinary upload failed for ${exerciseName}: ${error.message}`);
    return imageUrl;
  }
};

const buildExerciseDoc = async (entry) => {
  const primaryMuscles = (entry.primaryMuscles || []).map((muscle) => String(muscle).trim()).filter(Boolean);
  const secondaryMuscles = (entry.secondaryMuscles || []).map((muscle) => String(muscle).trim()).filter(Boolean);
  const instructions = Array.isArray(entry.instructions) ? entry.instructions.filter(Boolean) : [];
  const sourceImages = Array.isArray(entry.images)
    ? entry.images.map((image) => `https://raw.githubusercontent.com/yuhonas/free-exercise-db/master/exercises/${image}`)
    : [];

  const imageUrls = [];
  for (const imageUrl of sourceImages) {
    imageUrls.push(await uploadImageToCloudinary(imageUrl, entry.name));
  }

  return {
    name: entry.name,
    slug: slugify(entry.name || entry.id),
    category: normalizeCategory(entry.category),
    primaryMuscles,
    secondaryMuscles,
    equipment: normalizeEquipment(entry.equipment),
    difficulty: normalizeDifficulty(entry.level),
    instructions,
    imageUrls,
    source: 'seeded',
    isCustom: false,
    isPremium: false,
    tags: [entry.category, ...(primaryMuscles || [])],
  };
};

(async () => {
  if (!fs.existsSync(datasetPath)) {
    console.error(`Dataset file not found at ${datasetPath}. Download it first.`);
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB at ${uri}`);

    const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    const docs = [];
    for (const entry of dataset) {
      docs.push(await buildExerciseDoc(entry));
    }

    const inserted = [];
    const skipped = [];
    const failed = [];

    for (const doc of docs) {
      try {
        const existing = await Exercise.findOne({ slug: doc.slug });
        if (existing) {
          await Exercise.updateOne(
            { _id: existing._id },
            {
              $set: {
                ...doc,
                slug: existing.slug,
                source: 'seeded',
              },
            }
          );
          skipped.push(doc.name);
          continue;
        }

        const exercise = new Exercise(doc);
        await exercise.save();
        inserted.push(doc.name);
      } catch (error) {
        failed.push({ name: doc.name, reason: error.message });
      }
    }

    console.log(`Seed complete. Inserted: ${inserted.length}; Skipped duplicates: ${skipped.length}; Failed: ${failed.length}`);
    if (failed.length) {
      console.log('Failed entries:');
      failed.slice(0, 10).forEach((item) => console.log(`- ${item.name}: ${item.reason}`));
    }
  } catch (error) {
    console.error('Seed script failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
