export interface Prompt {
  id: string;
  text: string;
  hint: string;
  category: 'math' | 'sac' | 'general' | 'wacky';
}

export const CATEGORIES = [
  { id: 'all', label: 'All Prompts', icon: 'Sparkles', color: 'from-indigo-500 to-purple-600' },
  { id: 'math', label: '📐 Math & Numbers', icon: 'Binary', color: 'from-amber-500 to-orange-600' },
  { id: 'sac', label: '🌴 SAC & Local Campus', icon: 'GraduationCap', color: 'from-red-600 to-rose-700' },
  { id: 'general', label: '💬 General Icebreakers', icon: 'MessageCircle', color: 'from-emerald-500 to-teal-600' },
  { id: 'wacky', label: '🎭 Wacky & Rapid-Fire', icon: 'Flame', color: 'from-fuchsia-500 to-pink-600' }
] as const;

export const STATIC_PROMPTS: Prompt[] = [
  // --- MATH & NUMBERS ---
  {
    id: 'math-1',
    text: 'The student whose birthday (day of the month) is closest to Pi Day (March 14) begins.',
    hint: 'Compare dates! E.g. March 14, April 14, etc. Find the absolute distance to March 14.',
    category: 'math'
  },
  {
    id: 'math-2',
    text: 'The student whose browser has the highest number of active open tabs begins.',
    hint: 'Time to count tabs! Don\'t count private or hidden ones.',
    category: 'math'
  },
  {
    id: 'math-3',
    text: 'The student whose phone battery percentage is closest to a multiple of 10 begins.',
    hint: 'Look at your phone battery. Who is closest to 10%, 20%, 30%, ..., 100%?',
    category: 'math'
  },
  {
    id: 'math-4',
    text: 'The student whose height in inches (or centimeters) is a prime number starts.',
    hint: 'Calculate height in inches (e.g. 5\'5" = 65, 5\'7" = 67 - which is prime!). If nobody is prime, closest prime starts.',
    category: 'math'
  },
  {
    id: 'math-5',
    text: 'The student who has the most keys on their real-world keychain begins.',
    hint: 'Pull out your keys and count! Digital keys don\'t count.',
    category: 'math'
  },
  {
    id: 'math-6',
    text: 'The student whose full legal name (First + Middle + Last) contains the highest total number of letters starts.',
    hint: 'Count the characters, excluding spaces. Tiebreaker: most vowels!',
    category: 'math'
  },
  {
    id: 'math-7',
    text: 'The student who can recite the most digits of Pi (π) from memory starts.',
    hint: 'Recite in turn! 3.14159... who gets the furthest without a mistake?',
    category: 'math'
  },
  {
    id: 'math-8',
    text: 'The student whose home street number has the highest sum of its individual digits begins.',
    hint: 'If your address is 1720, your sum is 1 + 7 + 2 + 0 = 10.',
    category: 'math'
  },
  {
    id: 'math-9',
    text: 'The student who last used a calculator (physical or app) begins.',
    hint: 'Check your recent phone apps or desktop calculator. Who was most recent?',
    category: 'math'
  },
  {
    id: 'math-10',
    text: 'The student whose age is closest to a perfect square (16, 25, 36, 49, 64...) begins.',
    hint: 'Quickly check the distance: age 21 is distance 4 from 25, age 18 is distance 2 from 16.',
    category: 'math'
  },
  {
    id: 'math-11',
    text: 'The student who has the most pockets on their current clothing begins.',
    hint: 'Count pants, jackets, shirts, hoodies. Watch out for secret inner pockets!',
    category: 'math'
  },
  {
    id: 'math-12',
    text: 'The student who last calculated a tip at a restaurant or food truck without using a phone calculator starts.',
    hint: 'Mental math power! Who did it most recently?',
    category: 'math'
  },
  {
    id: 'math-13',
    text: 'The student whose shoe size is a prime or half-integer starts.',
    hint: 'E.g., Size 7 (prime!), Size 11 (prime!). Compare sizes.',
    category: 'math'
  },
  {
    id: 'math-14',
    text: 'The student whose birth month is prime (Feb [2], Mar [3], May [5], Jul [7], Nov [11]) starts.',
    hint: 'If multiple, the one born closest to the start of the year wins.',
    category: 'math'
  },
  {
    id: 'math-15',
    text: 'The student who can guess the current minute of the hour closest to the actual time without looking begins.',
    hint: 'No looking at clocks! Everyone call out your guess. The moderator reveals the exact minute.',
    category: 'math'
  },
  {
    id: 'math-16',
    text: 'The student whose hand span (tip of thumb to tip of pinky when stretched) is the shortest begins.',
    hint: 'Measure thumbs-to-pinkies. Good for finding the smallest scale factor!',
    category: 'math'
  },

  // --- SANTA ANA COLLEGE & LOCAL CAMPUS ---
  {
    id: 'sac-1',
    text: 'The student who has the shortest commute to Santa Ana College (main campus on W 17th St) starts.',
    hint: 'Estimate mileage or travel time to the main SAC campus. Nearest neighbor wins!',
    category: 'sac'
  },
  {
    id: 'sac-2',
    text: 'The student who most recently walked past or visited the SAC Nealley Library starts.',
    hint: 'Who was studying, borrowing a book, or using the computer labs at Nealley most recently?',
    category: 'sac'
  },
  {
    id: 'sac-3',
    text: 'The student who is wearing the most Santa Ana College red, black, or white colors today starts.',
    hint: 'Do a quick visual count of items of clothing or accessories matching SAC Dons colors!',
    category: 'sac'
  },
  {
    id: 'sac-4',
    text: 'The student who most recently visited the Tessmann Planetarium at SAC starts.',
    hint: 'The historic planetarium is an Orange County icon. Who stepped foot there or walked by most recently?',
    category: 'sac'
  },
  {
    id: 'sac-5',
    text: 'The student who has taken or is taking the highest number of math/science units at SAC starts.',
    hint: 'Add up your course units! Algebra, Calculus, Stats, Chemistry... who has the highest total?',
    category: 'sac'
  },
  {
    id: 'sac-6',
    text: 'The student who has drank a horchata, hibiscus tea (jamaica), or fruit agua fresca most recently in Santa Ana starts.',
    hint: 'Think about local taco shops, supermarkets, or cafes. Who enjoyed one most recently?',
    category: 'sac'
  },
  {
    id: 'sac-7',
    text: 'The student who most recently traveled on Bristol Street, 17th Street, or Flower Street in Santa Ana starts.',
    hint: 'These major streets surround the SAC campus. Who drove, walked, or rode the bus there most recently?',
    category: 'sac'
  },
  {
    id: 'sac-8',
    text: 'The student who can name the local high school closest to their current location starts.',
    hint: 'Is it Santa Ana High, Segerstrom, Century, Saddleback, or Godinez? Quickest correct name wins!',
    category: 'sac'
  },
  {
    id: 'sac-9',
    text: 'The student who has attended Santa Ana College for the highest number of semesters starts.',
    hint: 'Includes current semester. Let\'s hear who has the most tenure as a proud SAC Don!',
    category: 'sac'
  },
  {
    id: 'sac-10',
    text: 'The student who most recently visited 4th Street Market or Downtown Santa Ana (DTSA) starts.',
    hint: 'DTSA has great food and community events. Who was there most recently?',
    category: 'sac'
  },
  {
    id: 'sac-11',
    text: 'The student who lived in California the shortest/longest amount of time starts (the group decides which extreme wins!).',
    hint: 'Share your California story! Let the group vote on who goes first based on time spent.',
    category: 'sac'
  },
  {
    id: 'sac-12',
    text: 'The student who can spot the most palm trees from their current window starts.',
    hint: 'Take a quick glance outside. If zero, the person who saw a palm tree most recently on the freeway starts.',
    category: 'sac'
  },

  // --- GENERAL ICEBREAKERS ---
  {
    id: 'gen-1',
    text: 'The student who woke up the earliest today starts.',
    hint: 'Compare morning alarm times! Who was awake before the sun rose?',
    category: 'general'
  },
  {
    id: 'gen-2',
    text: 'The student who most recently finished reading a novel or book starts.',
    hint: 'Textbooks don\'t count! Which book was it, and when was the final page turned?',
    category: 'general'
  },
  {
    id: 'gen-3',
    text: 'The student who most recently went to a concert or live musical performance starts.',
    hint: 'From stadium shows to local garage bands or street busking - who was there?',
    category: 'general'
  },
  {
    id: 'gen-4',
    text: 'The student who last crafted, drew, painted, or built a physical item starts.',
    hint: 'Woodworking, knitting, sketching, origami, or building LEGO. What was it?',
    category: 'general'
  },
  {
    id: 'gen-5',
    text: 'The student who most recently went on a nature hike or outdoor walk starts.',
    hint: 'A walk in a local park, state reserve, or mountain trail counts.',
    category: 'general'
  },
  {
    id: 'gen-6',
    text: 'The student who has traveled the furthest away from their birthplace starts.',
    hint: 'Who has crossed the most lines of latitude and longitude from where they were born?',
    category: 'general'
  },
  {
    id: 'gen-7',
    text: 'The student with the longest first name (most characters) begins.',
    hint: 'Spell it out! If there is a tie, alphabetical order of the last letter decides.',
    category: 'general'
  },
  {
    id: 'gen-8',
    text: 'The student who last traveled on an airplane starts.',
    hint: 'When was your last flight? Where was the destination?',
    category: 'general'
  },
  {
    id: 'gen-9',
    text: 'The student who most recently drank a glass of water starts.',
    hint: 'Hydration check! Grab your water bottle and see who took a sip most recently.',
    category: 'general'
  },
  {
    id: 'gen-10',
    text: 'The student who has the most pets (or has lived with the most pets) starts.',
    hint: 'Dogs, cats, fish, hamsters, turtles... add up your current animal companions!',
    category: 'general'
  },
  {
    id: 'gen-11',
    text: 'The student who can name the most states/territories starts.',
    hint: 'Think fast: who can list the highest number of US States in 15 seconds?',
    category: 'general'
  },
  {
    id: 'gen-12',
    text: 'The student who has done a random act of kindness most recently starts.',
    hint: 'Holding a door, helping a neighbor, or paying forward a coffee. Let the group share their recent kindness stories!',
    category: 'general'
  },
  {
    id: 'gen-13',
    text: 'The student whose last sent text message ends with an emoji starts.',
    hint: 'Open your messages app! What was the emoji? If multiple students have them, the funniest emoji starts.',
    category: 'general'
  },
  {
    id: 'gen-14',
    text: 'The student who most recently enjoyed a warm beverage (tea, coffee, hot chocolate, or cider) starts.',
    hint: 'Check your mugs and cups! Who is currently sipping or had a warm cup closest to now?',
    category: 'general'
  },
  {
    id: 'gen-15',
    text: 'The student currently sitting the furthest geographical distance from a standard grocery store starts.',
    hint: 'Estimate your distance to the nearest Ralphs, Food 4 Less, or local bodega. Most remote starts!',
    category: 'general'
  },
  {
    id: 'gen-16',
    text: 'The student who most recently ate some fresh fruit (apple, orange, banana, berries, etc.) starts.',
    hint: 'Vitamins checklist! Which fruit was it and when did you eat it today?',
    category: 'general'
  },
  {
    id: 'gen-17',
    text: 'The student who has traveled to the highest total number of sovereign countries starts.',
    hint: 'List your passports stamps! Ties can be settled by who took the most recent international trip.',
    category: 'general'
  },
  {
    id: 'gen-18',
    text: 'The student who has the oldest email sitting unread in their secondary/personal email inbox starts.',
    hint: 'Check your spam or archives! Who has an unread email from 2023, 2021, or earlier?',
    category: 'general'
  },
  {
    id: 'gen-19',
    text: 'The student who most recently updated a profile picture on any workspace, messenger, or social media app starts.',
    hint: 'Check your discord, canvas, or whatsapp update history. Who updated closest to today?',
    category: 'general'
  },
  {
    id: 'gen-20',
    text: 'The student who is wearing the oldest physical piece of clothing (by age of the garment) starts.',
    hint: 'Is it a vintage jacket, a hand-me-down sweater, or a band t-shirt from 10 years ago? Give your estimates!',
    category: 'general'
  },
  {
    id: 'gen-21',
    text: 'The student who most recently watched a movie in an actual physical movie theater starts.',
    hint: 'Popcorn & screens! What was the name of the film and which theater did you visit?',
    category: 'general'
  },

  // --- WACKY & RAPID-FIRE ---
  {
    id: 'wack-1',
    text: 'The student who is wearing the highest number of buttons or zippers starts.',
    hint: 'Check your jeans, hoodies, bags, and coats. Count \'em up!',
    category: 'wacky'
  },
  {
    id: 'wack-2',
    text: 'The student whose phone battery percentage is the absolute lowest starts.',
    hint: 'Show your screens! Low battery stands first, high battery goes to recharge.',
    category: 'wacky'
  },
  {
    id: 'wack-3',
    text: 'The student who can hold a plank position the longest (or just makes the most convincing boast) starts.',
    hint: 'Who is ready to drop and do core work? Or just state your record time!',
    category: 'wacky'
  },
  {
    id: 'wack-4',
    text: 'The student who most recently ate something spicy starts.',
    hint: 'Salsa, hot sauce, jalapeños, spicy chips? Who has fire on their tongue?',
    category: 'wacky'
  },
  {
    id: 'wack-5',
    text: 'The student who has the tallest houseplant currently in their room starts.',
    hint: 'Measured from the soil to the highest leaf. If you have no plants, a fake plant or desktop tree counts!',
    category: 'wacky'
  },
  {
    id: 'wack-6',
    text: 'The student who had the weirdest or most vivid dream last night starts.',
    hint: 'Two-sentence recount of your dream. The group votes on which was the strangest!',
    category: 'wacky'
  },
  {
    id: 'wack-7',
    text: 'The student who is sitting on the most comfortable or most unusual chair starts.',
    hint: 'Desk chair, exercise ball, floor cushion, couch, or stool? Describe your seating situation!',
    category: 'wacky'
  },
  {
    id: 'wack-8',
    text: 'The student who took typing/keyboarding classes most recently starts.',
    hint: 'Whether in elementary school, high school, or a quick online typing test today!',
    category: 'wacky'
  },
  {
    id: 'wack-9',
    text: 'The student who can snap their fingers the fastest in a 5-second trial starts.',
    hint: 'Count your clicks! Have someone time you for 5 seconds of rapid-fire snapping.',
    category: 'wacky'
  },
  {
    id: 'wack-10',
    text: 'The student who has the most remote controls in their immediate reaching distance starts.',
    hint: 'TV, AC, Apple TV, gaming consoles, ceiling fans... count what you can reach without standing up!',
    category: 'wacky'
  },
  {
    id: 'wack-11',
    text: 'The student who last physically touched a real coin (penny, nickel, dime, quarter) or paper dollar bill starts.',
    hint: 'Cash is rare these days! Who held some physically most recently?',
    category: 'wacky'
  },
  {
    id: 'wack-12',
    text: 'The student whose current desk/table is the cleanest or most meticulously organized starts.',
    hint: 'Do a quick visual swap. No clutter vs lots of notebooks. If tied, cleanest table wins!',
    category: 'wacky'
  },
  {
    id: 'wack-13',
    text: 'The student who has the highest number of active daily alarms set on their phone starts.',
    hint: 'Open your Clock app. Be honest: who has 5, 10, or 15 alarms configured for the morning?',
    category: 'wacky'
  },
  {
    id: 'wack-14',
    text: 'The student whose favorite color is closest to the color of the ceiling in their room starts.',
    hint: 'Look up! Is it classic eggshell white, beige, grey, or something adventurous? Compare choices.',
    category: 'wacky'
  },
  {
    id: 'wack-15',
    text: 'The student who can name 3 orange-colored things in their current room the fastest starts.',
    hint: 'Ready, set, go! Spot orange items (highlighters, book covers, snacks). Speak first to win.',
    category: 'wacky'
  },
  {
    id: 'wack-16',
    text: 'The student whose most recent cooking attempt was the most absolute disaster starts.',
    hint: 'Burnt toast, over-salted eggs, exploded microwave dishes? Share your culinary fails!',
    category: 'wacky'
  },
  {
    id: 'wack-17',
    text: 'The student who possesses the brightest colored pattern socks currently on their feet starts.',
    hint: 'Show off your ankle-wear! Best colors, stripes, or wacky illustrations wins.',
    category: 'wacky'
  },
  {
    id: 'wack-18',
    text: 'The student who has the highest count of apps currently running in their background phone task manager starts.',
    hint: 'Swipe open the app selector. Who has 40 apps open because they never close them?',
    category: 'wacky'
  }
];
