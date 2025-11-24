// app/diseaseData.ts

export interface DiseaseInfo {
  name: string;
  description: string;
  treatment: string;
  status: 'healthy' | 'danger' | 'warning';
}

export const diseaseData: Record<string, DiseaseInfo> = {
  // --- HEALTHY PLANTS ---
  'Apple___healthy': {
    name: "Apple - Healthy",
    description: "Your apple tree leaves look vigorous and free of spots or lesions.",
    treatment: "Continue with regular watering and fertilization schedules. Monitor for seasonal pests.",
    status: 'healthy'
  },
  'Blueberry___healthy': {
    name: "Blueberry - Healthy",
    description: "The foliage is vibrant with no signs of chlorosis or fungal infection.",
    treatment: "Maintain acidic soil pH (4.5-5.5) and ensure consistent moisture.",
    status: 'healthy'
  },
  'Cherry_(including_sour)___healthy': {
    name: "Cherry - Healthy",
    description: "Leaves are green and intact. No signs of mildew or rot.",
    treatment: "Prune regularly to maintain airflow and prevent future fungal issues.",
    status: 'healthy'
  },
  'Corn_(maize)___healthy': {
    name: "Corn - Healthy",
    description: "Stalks are strong and leaves are uniform in color without streaks.",
    treatment: "Ensure adequate nitrogen supply during the rapid growth phase.",
    status: 'healthy'
  },
  'Grape___healthy': {
    name: "Grape - Healthy",
    description: "Vines appear robust with clear, green leaves.",
    treatment: "Keep vines trained on trellises to ensure good sun exposure and airflow.",
    status: 'healthy'
  },
  'Peach___healthy': {
    name: "Peach - Healthy",
    description: "Foliage is lush and free of leaf curl or bacterial spots.",
    treatment: "Apply a dormant spray in winter to prevent spring leaf curl.",
    status: 'healthy'
  },
  'Pepper,_bell___healthy': {
    name: "Bell Pepper - Healthy",
    description: "Plant is sturdy with glossy green leaves.",
    treatment: "Stake plants as they grow heavy with fruit to prevent stem breakage.",
    status: 'healthy'
  },
  'Potato___healthy': {
    name: "Potato - Healthy",
    description: "Leaves are free of blight spots and insect damage.",
    treatment: "Hill up soil around the base to protect developing tubers from sunlight.",
    status: 'healthy'
  },
  'Raspberry___healthy': {
    name: "Raspberry - Healthy",
    description: "Canes are green and leaves are free of rust or mosaic patterns.",
    treatment: "Prune old canes after harvest to encourage new growth.",
    status: 'healthy'
  },
  'Soybean___healthy': {
    name: "Soybean - Healthy",
    description: "Your soybean plant is thriving with no signs of rust or discoloration.",
    treatment: "Keep the area weed-free to reduce competition for nutrients.",
    status: 'healthy'
  },
  'Squash___healthy': { // Added just in case, though not in your list
    name: "Squash - Healthy",
    description: "Leaves are large, green, and free of powdery residue.",
    treatment: "Water at the base to keep leaves dry and prevent mildew.",
    status: 'healthy'
  },
  'Strawberry___healthy': {
    name: "Strawberry - Healthy",
    description: "Low-growing foliage is green and crisp.",
    treatment: "Mulch with straw to keep fruit off the soil and retain moisture.",
    status: 'healthy'
  },
  'Tomato___healthy': {
    name: "Tomato - Healthy",
    description: "Plant shows vigorous growth with no spotting or wilting.",
    treatment: "Remove suckers to focus energy on fruit production. Water consistently.",
    status: 'healthy'
  },

  // --- APPLE DISEASES ---
  'Apple___Apple_scab': {
    name: "Apple Scab",
    description: "A fungal disease causing olive-green to black spots on leaves and fruit.",
    treatment: "Rake up and destroy fallen leaves. Apply fungicides like Captan or Sulfur early in the season.",
    status: 'danger'
  },
  'Apple___Black_rot': {
    name: "Black Rot",
    description: "Causes purple spots on leaves and rotting, mummified fruit.",
    treatment: "Prune out dead wood and remove mummified fruit. Apply fungicides during the growing season.",
    status: 'danger'
  },
  'Apple___Cedar_apple_rust': {
    name: "Cedar Apple Rust",
    description: "Bright orange-yellow spots on leaves. Requires juniper trees nearby to complete its cycle.",
    treatment: "Remove nearby juniper/cedar trees if possible. Apply fungicides at bud break.",
    status: 'warning'
  },

  // --- CHERRY DISEASES ---
  'Cherry_(including_sour)___Powdery_mildew': {
    name: "Powdery Mildew",
    description: "White, powdery fungal growth on leaves and stems.",
    treatment: "Prune for airflow. Apply sulfur-based fungicides or neem oil.",
    status: 'warning'
  },

  // --- CORN DISEASES ---
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    name: "Gray Leaf Spot",
    description: "Rectangular, gray-to-tan lesions on leaves.",
    treatment: "Rotate crops. Use resistant hybrids. Apply fungicides if infection is severe.",
    status: 'danger'
  },
  'Corn_(maize)___Common_rust_': {
    name: "Common Rust",
    description: "Pustules on leaves that release rusty red spores.",
    treatment: "Plant resistant varieties. Fungicides are rarely needed unless infection is very early.",
    status: 'warning'
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    name: "Northern Leaf Blight",
    description: "Long, cigar-shaped grayish lesions on leaves.",
    treatment: "Use resistant hybrids. Rotate crops to reduce overwintering spores.",
    status: 'danger'
  },

  // --- GRAPE DISEASES ---
  'Grape___Black_rot': {
    name: "Black Rot",
    description: "Small brown leaf spots and shriveled, black grapes.",
    treatment: "Remove mummified berries. Apply fungicides (Mancozeb/Myclobutanil) from bud break to fruit set.",
    status: 'danger'
  },
  'Grape___Esca_(Black_Measles)': {
    name: "Esca (Black Measles)",
    description: "Leaves show 'tiger stripes' (yellow/red between veins). Berries spot.",
    treatment: "No cure. Remove infected vines. Prune late in winter to reduce infection risk.",
    status: 'danger'
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    name: "Isariopsis Leaf Spot",
    description: "Irregular brown spots on leaves with a fuzzy appearance.",
    treatment: "Apply fungicides used for other grape diseases. Improve air circulation.",
    status: 'warning'
  },

  // --- ORANGE DISEASES ---
  'Orange___Haunglongbing_(Citrus_greening)': {
    name: "Citrus Greening (HLB)",
    description: "Mottled yellow leaves and misshapen, green/bitter fruit. Very serious.",
    treatment: "There is no cure. Remove and destroy the tree to prevent spread. Control psyllid insects.",
    status: 'danger'
  },

  // --- PEACH DISEASES ---
  'Peach___Bacterial_spot': {
    name: "Bacterial Spot",
    description: "Small, water-soaked spots on leaves that turn into holes ('shot hole').",
    treatment: "Apply copper sprays or oxytetracycline during the growing season. Plant resistant varieties.",
    status: 'warning'
  },

  // --- PEPPER DISEASES ---
  'Pepper,_bell___Bacterial_spot': {
    name: "Bacterial Spot",
    description: "Small dark spots on leaves and fruit. Leaves may turn yellow and drop.",
    treatment: "Use copper-based bactericides. Remove infected debris. Avoid overhead watering.",
    status: 'danger'
  },

  // --- POTATO DISEASES ---
  'Potato___Early_blight': {
    name: "Early Blight",
    description: "Concentric 'bullseye' rings on lower leaves.",
    treatment: "Apply copper fungicide. Mulch soil to prevent spore splash.",
    status: 'warning'
  },
  'Potato___Late_blight': {
    name: "Late Blight",
    description: "Large, dark, water-soaked spots. White fuzz on leaf undersides. (Caused the Irish Famine).",
    treatment: "Remove infected plants immediately. Apply fungicides preventatively.",
    status: 'danger'
  },

  // --- SQUASH DISEASES ---
  'Squash___Powdery_mildew': {
    name: "Powdery Mildew",
    description: "White, talcum-powder-like growth on leaf surfaces.",
    treatment: "Apply Neem oil or sulfur. Water at the base, not on leaves.",
    status: 'warning'
  },

  // --- STRAWBERRY DISEASES ---
  'Strawberry___Leaf_scorch': {
    name: "Leaf Scorch",
    description: "Irregular purple blotches on leaves that turn brown.",
    treatment: "Remove infected leaves. Improve air circulation. Fungicides may be needed.",
    status: 'warning'
  },

  // --- TOMATO DISEASES ---
  'Tomato___Bacterial_spot': {
    name: "Bacterial Spot",
    description: "Small, dark, greasy spots on leaves and fruit.",
    treatment: "Use copper sprays. Avoid overhead watering. Clean tools regularly.",
    status: 'danger'
  },
  'Tomato___Early_blight': {
    name: "Early Blight",
    description: "Dark brown spots with concentric rings, starting on lower leaves.",
    treatment: "Prune lower leaves to stop soil splash. Use copper fungicide or Neem oil.",
    status: 'warning'
  },
  'Tomato___Late_blight': {
    name: "Late Blight",
    description: "Greasy, gray-green spots on leaves. Spreads rapidly in cool, wet weather.",
    treatment: "Remove infected plants immediately to save the crop. Fungicides are preventative only.",
    status: 'danger'
  },
  'Tomato___Leaf_Mold': {
    name: "Leaf Mold",
    description: "Yellow spots on top of leaves, olive-green mold on the bottom.",
    treatment: "Reduce humidity. improve airflow. Fungicides can help if caught early.",
    status: 'warning'
  },
  'Tomato___Septoria_leaf_spot': {
    name: "Septoria Leaf Spot",
    description: "Small circular spots with dark borders and gray centers.",
    treatment: "Remove infected leaves. Mulch soil. Apply fungicide.",
    status: 'warning'
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    name: "Two-Spotted Spider Mite",
    description: "Tiny yellow stippling on leaves. Webbing may be visible.",
    treatment: "Spray with strong stream of water. Use insecticidal soap or Neem oil.",
    status: 'warning'
  },
  'Tomato___Target_Spot': {
    name: "Target Spot",
    description: "Brown lesions with concentric rings (targets) on leaves and stems.",
    treatment: "Improve airflow. Apply fungicides like chlorothalonil or copper.",
    status: 'warning'
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    name: "Yellow Leaf Curl Virus",
    description: "Leaves curl upward and turn yellow. Plant becomes stunted.",
    treatment: "Remove infected plants. Control whiteflies (the carriers) with sticky traps or soap.",
    status: 'danger'
  },
  'Tomato___Tomato_mosaic_virus': {
    name: "Tomato Mosaic Virus",
    description: "Mottled light and dark green patterns on leaves.",
    treatment: "No cure. Remove infected plants. Wash hands thoroughly (can spread via tobacco).",
    status: 'danger'
  }
};