import type { StaticImageData } from 'next/image'

import orionNebula from '@/images/astro/orion-nebula.jpg'
import andromedaGalaxy from '@/images/astro/andromeda-galaxy.jpg'
import andromedaRawFrame from '@/images/astro/andromeda-raw-frame.jpg'
import maunaKeaMilkyWay from '@/images/astro/mauna-kea-milky-way.jpg'
import lagoonNebula from '@/images/astro/lagoon-nebula.jpg'
import trifidNebula from '@/images/astro/trifid-nebula.jpg'
import pinwheelGalaxy from '@/images/astro/pinwheel-galaxy.jpg'
import omegaCentauri from '@/images/astro/omega-centauri.jpg'
import ringNebula from '@/images/astro/ring-nebula.jpg'
import introUnderTheStars from '@/images/astro/intro-under-the-stars.jpg'
import sceneTrackerCalibration from '@/images/astro/scene-tracker-calibration.jpg'
import sceneCameraScreen from '@/images/astro/scene-camera-screen.jpg'
import scenePolarAlignment from '@/images/astro/scene-polar-alignment.jpg'
import sunsetI from '@/images/astro/sunset-i.jpg'
import sunsetII from '@/images/astro/sunset-ii.jpg'

export type CaptureDetail = { label: string; value: string }

export type AstroPhoto = {
  id: string
  kicker?: string
  title: string
  catalog?: string
  meta: string
  description?: string
  story?: string[]
  capture?: CaptureDetail[]
  image: StaticImageData
}

export type SceneShot = { image: StaticImageData; caption: string }

export const introImage: StaticImageData = introUnderTheStars

const stellinaCapture = (date: string): CaptureDetail[] => [
  { label: 'Date', value: date },
  { label: 'Location', value: 'Truro, MA' },
  { label: 'Sky quality', value: 'Bortle 3' },
  { label: 'Equipment', value: 'Vaonis Stellina smart telescope' },
]

export const photos: AstroPhoto[] = [
  {
    id: 'orion-nebula',
    kicker: 'Emission nebula',
    title: 'The Orion Nebula',
    catalog: 'M42',
    meta: 'Simsbury, Connecticut · December 2024',
    description:
      'The Orion Nebula (M42) is a massive stellar nursery about 1,344 light-years away, spanning 24 light-years across.',
    story: [
      'This was my most recent "tracked" capture in Simsbury, CT. Only a 10-minute drive from my home, the open horizon of a local farm helped immensely. The perfect new moon, along with the extremely late hours, contributed to the quality of the capture.',
      "However, the night initially started off extremely cold and partly cloudy, preventing me from polar aligning my star tracker with Polaris for the first hour. The night felt unhopeful—it seemed as if I wasn't going to get lucky. Thankfully, I waited for an opportunity between two clouds to quickly align with the North Star and successfully calibrated my tracker.",
      "Even though it remained partly cloudy, especially near the horizon, looking straight up I spotted the Orion constellation. While the skies in a Bortle 4 zone (an indicator of light pollution levels) aren't ideal for stargazing, the power of tracking—a device that moves with the Earth's rotation to keep the target in frame during long exposures—along with careful post-processing, allowed me to capture this beautiful nebula. With a magnitude of 4.0 (for reference, the lower the magnitude, the more visible the object; a full moon is -12.7, and Mars is -1.29), the details of this celestial wonder came to life.",
    ],
    capture: [
      { label: 'Date', value: 'December 29th, 2024' },
      { label: 'Location', value: 'Barn Door Hills, Simsbury, CT' },
      { label: 'Camera', value: 'Canon EOS 6D (20.2 MP)' },
      { label: 'Lens', value: 'Canon EF 28-350mm f/3.5-5.6L IS USM' },
      { label: 'Settings', value: 'ISO 800, f/5.6, 350mm, 30s' },
      { label: 'Integration', value: '60 × 30s = 30 minutes total' },
      { label: 'Tracker', value: 'Sky-Watcher Star Adventurer GTi' },
      { label: 'Processing', value: 'DeepSkyStacker, Adobe Lightroom' },
    ],
    image: orionNebula,
  },
  {
    id: 'andromeda-galaxy',
    kicker: 'Spiral galaxy',
    title: 'The Andromeda Galaxy',
    catalog: 'M31',
    meta: 'Simsbury, Connecticut · December 2024',
    description:
      'The Andromeda Galaxy (M31) is a spiral galaxy located about 2.5 million light-years away, spanning an incredible 220,000 light-years across. It is the closest major galaxy to the Milky Way, predicted to collide with our galaxy in about 4.5 billion years.',
    story: [
      'Taken in my own backyard, this was the first deep sky object I captured after purchasing the Star Adventurer GTi. Surprisingly, despite only having about 15 minutes of usable (and unfortunately unfocused) exposure, this shot took many hours to complete.',
      'On a cold December Saturday night, I spent from 7 PM to midnight going back and forth between my backyard and the family room—probably 15 times or more. It took several long, and at times frustrating, hours in below-freezing temperatures to learn how to properly calibrate and polar align my new tracker, all while trying to keep both my computer and hands warm.',
      "By the time I got everything aligned, Andromeda was already dipping below my backyard's high tree line. When I finally took a test exposure, I was surprised to see Andromeda perfectly framed between the bare branches of the winter trees. However, because everything in the sky moves, many exposures had to be tossed due to tree branches creeping into the frame. After about half an hour of shooting, I was left with just 15 minutes of usable data.",
      'At 2 AM, I uploaded the images to my computer, only to realize that all of them were slightly out of focus—a tough lesson learned the hard way. Still, as my first-ever deep sky capture, I was thrilled with what I managed to produce and excited by the possibilities of what I could achieve going forward.',
    ],
    capture: [
      { label: 'Date', value: 'December 26th, 2024' },
      { label: 'Location', value: 'Barn Door Hills, Simsbury, CT' },
      { label: 'Camera', value: 'Canon EOS 6D (20.2 MP)' },
      { label: 'Lens', value: 'Canon EF 28-350mm f/3.5-5.6L IS USM' },
      { label: 'Settings', value: 'ISO 1000, f/5.6, 350mm, 30s' },
      { label: 'Integration', value: '30 × 30s = 15 minutes total' },
      { label: 'Tracker', value: 'Sky-Watcher Star Adventurer GTi' },
      { label: 'Processing', value: 'DeepSkyStacker, Adobe Lightroom' },
    ],
    image: andromedaGalaxy,
  },
  {
    id: 'mauna-kea',
    kicker: 'Wide field',
    title: 'Milky Way over Mauna Kea',
    meta: 'Mauna Kea, Hawaii · July 2023',
    description:
      "My first-ever astrophotography experience, captured from one of the world's premier astronomical observation sites.",
    story: [
      'Taking a trip to the renowned Mauna Kea observatory with my family, this was my first ever experience with astrophotography. Being on top of a volcano in the middle of the largest ocean in the world, Mauna Kea was the #1 best star gazing I have experienced in my life.',
      'The glow of the Milky Way being visible to the naked eye, and being above the stratocumulus clouds, there is no doubt why this is a renowned observatory. Using my Canon Rebel T7 I took my first ever exposure of the stars with instructional help of a local guide. This is where I discovered the rush of capturing the night sky.',
    ],
    capture: [
      { label: 'Date', value: 'July 6th, 2023' },
      { label: 'Location', value: 'Mauna Kea Observatory, HI' },
      { label: 'Camera', value: 'Canon EOS Rebel T7 DSLR' },
      { label: 'Lens', value: 'Canon EF 75-300mm f/4-5.6 III' },
      { label: 'Settings', value: 'ISO 2500, f/4, 30mm, 8s' },
      { label: 'Integration', value: 'Single 8s exposure' },
      { label: 'Tracker', value: 'None (untracked)' },
      { label: 'Processing', value: 'Apple Photos' },
    ],
    image: maunaKeaMilkyWay,
  },
  {
    id: 'lagoon-nebula',
    kicker: 'Emission nebula',
    title: 'Lagoon Nebula',
    catalog: 'M8',
    meta: 'Truro, Massachusetts · August 2024',
    description:
      'The Lagoon Nebula (M8) is a vast star-forming region located about 4,000–6,000 light-years away in the constellation Sagittarius—spanning 110 light-years across.',
    capture: stellinaCapture('August 4th, 2024'),
    image: lagoonNebula,
  },
  {
    id: 'trifid-nebula',
    kicker: 'Emission nebula',
    title: 'Trifid Nebula',
    catalog: 'M20',
    meta: 'Truro, Massachusetts · August 2024',
    description:
      'The Trifid Nebula is a stunning star-forming region located about 4,100 light-years away in the constellation Sagittarius, spanning approximately 50 light-years across.',
    capture: stellinaCapture('August 4th, 2024'),
    image: trifidNebula,
  },
  {
    id: 'pinwheel-galaxy',
    kicker: 'Spiral galaxy',
    title: 'Pinwheel Galaxy',
    catalog: 'M101',
    meta: 'Truro, Massachusetts · August 2024',
    description:
      'The Pinwheel Galaxy is a face-on spiral galaxy about 21 million light-years away in the constellation Ursa Major, spanning 170,000 light-years and known for its bright star-forming regions.',
    capture: stellinaCapture('August 4th, 2024'),
    image: pinwheelGalaxy,
  },
  {
    id: 'omega-centauri',
    kicker: 'Globular cluster',
    title: 'Omega Centauri',
    catalog: 'NGC 5139',
    meta: 'Truro, Massachusetts · August 2024',
    description:
      'Omega Centauri is the largest globular cluster in the Milky Way, located about 16,000 light-years away in the constellation Centaurus, spanning 150 light-years and containing over 10 million stars.',
    capture: stellinaCapture('August 4th, 2024'),
    image: omegaCentauri,
  },
  {
    id: 'ring-nebula',
    kicker: 'Planetary nebula',
    title: 'Ring Nebula',
    catalog: 'M57',
    meta: 'Truro, Massachusetts · August 2024',
    description:
      'The Ring Nebula is a planetary nebula about 2,300 light-years away in the constellation Lyra, with its iconic glowing ring spanning roughly 1 light-year across.',
    capture: stellinaCapture('August 4th, 2024'),
    image: ringNebula,
  },
  {
    id: 'sunset-i',
    kicker: 'Epilogue · Earthbound',
    title: 'Sunset, I',
    meta: 'Spring 2025',
    capture: [{ label: 'Camera', value: 'Canon EOS Rebel T5' }],
    image: sunsetI,
  },
  {
    id: 'sunset-ii',
    kicker: 'Epilogue · Earthbound',
    title: 'Sunset, II',
    meta: 'Spring 2025',
    capture: [{ label: 'Camera', value: 'Canon EOS Rebel T5' }],
    image: sunsetII,
  },
]

export const compare = {
  raw: andromedaRawFrame,
  final: andromedaGalaxy,
  rawLabel: 'Single 30-second frame',
  finalLabel: 'Stacked & processed',
  note: 'The same target: one raw frame straight off the sensor, and the result of stacking 30 exposures in DeepSkyStacker and processing in Lightroom.',
}

export const scenes: SceneShot[] = [
  {
    image: sceneTrackerCalibration,
    caption:
      'Calibrating my Sky-Watcher Star Adventurer GTi using polar and two-star alignment. Precision is critical for long-exposure tracking.',
  },
  {
    image: sceneCameraScreen,
    caption:
      'Camera screen displaying one of the many 30-second exposures of the Orion Nebula during a cold December night in Simsbury, CT.',
  },
  {
    image: scenePolarAlignment,
    caption:
      'Polar aligning the tracker in my backyard during my first deep-sky session. Photo credit: my brother.',
  },
]

export const about: string[] = [
  "Hi, I'm Aki Bhabad, a 19-year-old amateur astrophotographer and a curious college freshman. Since I was a kid, I've always been fascinated by the night sky, and now, through astrophotography, I can pursue this fascination.",
  "What draws me to astrophotography isn't just the beauty of the cosmos—it's the challenge. Each capture requires planning, precision, patience, and often involves long, cold nights troubleshooting equipment in the dark. It's the kind of hard problem that forces you to learn constantly, adapt quickly, and persist even when conditions aren't ideal.",
  "I shoot primarily from Connecticut—often from my own backyard or nearby farms—working within the limitations of a Bortle 4 zone and unpredictable New England weather. With my Canon EOS 6D, telephoto lenses, and Sky-Watcher Star Adventurer GTi tracker, I've been able to capture nebulae, galaxies, and wide-field Milky Way shots that reveal details invisible to the naked eye.",
  "This gallery represents where I am now, but there's so much more I want to explore and capture. Each session teaches me something new, and every image is a step forward in understanding both the night sky and the craft of astrophotography.",
]

export const workflow: string =
  'Each deep-sky capture follows a meticulous process: I start by polar aligning my Star Adventurer GTi tracker using both polar and two-star alignment for precision. Once calibrated, I take dozens of long exposures (typically 30 seconds each) over the course of 15–30 minutes or more, depending on conditions. These "light frames" are then brought into DeepSkyStacker, where they\'re aligned and combined to reduce noise and enhance faint details. Finally, I use Adobe Lightroom for careful post-processing—adjusting contrast, clarity, color balance, and noise reduction—to bring out the intricate structures and colors hidden in the raw data. It\'s a process that requires patience, precision, and a willingness to learn from each session.'

export const gear: { category: string; items: string[] }[] = [
  {
    category: 'Cameras',
    items: ['Canon EOS 6D full-frame DSLR (20.2 MP)', 'Canon EOS Rebel T7 DSLR'],
  },
  {
    category: 'Lenses',
    items: ['Canon EF 28-350mm f/3.5-5.6L IS USM', 'Canon EF 75-300mm f/4-5.6 III'],
  },
  {
    category: 'Tracking',
    items: ['Sky-Watcher Star Adventurer GTi equatorial mount'],
  },
  {
    category: 'Smart telescope',
    items: ['Vaonis Stellina (borrowed)'],
  },
  {
    category: 'Software',
    items: ['DeepSkyStacker', 'Adobe Lightroom', 'Apple Photos'],
  },
]
