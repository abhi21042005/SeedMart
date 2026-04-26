// Rule-based chatbot logic for crop recommendations
const cropDatabase = {
  wheat: {
    seeds: [
      { name: 'HD-2967 Wheat Seeds', description: 'High-yielding variety, suitable for irrigated conditions', price: '₹250/kg' },
      { name: 'PBW-343 Wheat Seeds', description: 'Early maturing, rust-resistant variety', price: '₹280/kg' },
      { name: 'WH-542 Wheat Seeds', description: 'Amber grain, good for chapati making', price: '₹260/kg' },
    ],
    fertilizers: [
      { name: 'DAP (Di-Ammonium Phosphate)', description: 'Apply at sowing time, 100 kg/hectare', price: '₹1,350/bag' },
      { name: 'Urea (46% N)', description: 'Apply in 2-3 splits during growth stages', price: '₹267/bag' },
      { name: 'MOP (Muriate of Potash)', description: 'Apply at sowing, 40 kg/hectare', price: '₹870/bag' },
    ],
    tips: 'Best sowing time: October-November. Ensure proper irrigation at crown root initiation and flowering stages.',
  },
  rice: {
    seeds: [
      { name: 'Pusa Basmati 1121', description: 'Extra-long grain, aromatic basmati variety', price: '₹320/kg' },
      { name: 'IR-64 Rice Seeds', description: 'Medium-duration, high-yielding non-basmati', price: '₹180/kg' },
      { name: 'Swarna (MTU-7029)', description: 'Popular variety for lowland areas', price: '₹200/kg' },
    ],
    fertilizers: [
      { name: 'NPK 10-26-26', description: 'Basal application at transplanting', price: '₹1,450/bag' },
      { name: 'Zinc Sulphate', description: 'Essential for rice, 25 kg/hectare', price: '₹480/bag' },
      { name: 'Urea (46% N)', description: 'Top-dress in 3 splits at tillering, PI, and heading', price: '₹267/bag' },
    ],
    tips: 'Maintain 5cm standing water during tillering. Use nursery seedlings of 21-25 days old for transplanting.',
  },
  corn: {
    seeds: [
      { name: 'Pioneer P3396 Hybrid', description: 'High-yield hybrid, drought tolerant', price: '₹850/kg' },
      { name: 'Dekalb DKC 9108', description: 'Single cross hybrid, excellent standability', price: '₹780/kg' },
      { name: 'HQPM-1 Seeds', description: 'Quality protein maize, nutritionally superior', price: '₹450/kg' },
    ],
    fertilizers: [
      { name: 'DAP (Di-Ammonium Phosphate)', description: 'Basal dose 100 kg/hectare', price: '₹1,350/bag' },
      { name: 'Urea (46% N)', description: 'Apply 60 kg at knee-high and 60 kg at tasseling', price: '₹267/bag' },
      { name: 'Boron 20%', description: 'Foliar spray for better grain filling', price: '₹350/kg' },
    ],
    tips: 'Plant spacing: 60cm x 20cm. Ensure good weed management in first 30 days. Critical irrigation at tasseling and grain filling.',
  },
  tomato: {
    seeds: [
      { name: 'Pusa Ruby Tomato Seeds', description: 'Determinate type, suitable for processing', price: '₹1,200/100g' },
      { name: 'Arka Rakshak F1', description: 'Triple disease resistant hybrid', price: '₹2,500/100g' },
      { name: 'NS-524 Hybrid', description: 'Firm fruits, excellent shelf life', price: '₹1,800/100g' },
    ],
    fertilizers: [
      { name: 'NPK 19-19-19', description: 'Water soluble, for drip fertigation', price: '₹1,650/bag' },
      { name: 'Calcium Nitrate', description: 'Prevents blossom end rot, apply weekly', price: '₹980/bag' },
      { name: 'Micronutrient Mixture', description: 'Contains Zn, Fe, Mn, Cu, B for healthy growth', price: '₹450/kg' },
    ],
    tips: 'Stake plants for better air circulation. Prune suckers for indeterminate varieties. Watch for early blight and late blight.',
  },
  cotton: {
    seeds: [
      { name: 'Bt Cotton RCH-134', description: 'Bollworm resistant, high-density planting', price: '₹930/packet' },
      { name: 'Ankur-3028 BG-II', description: 'Good fiber quality, medium maturity', price: '₹870/packet' },
      { name: 'Mahyco MRC-7351', description: 'High ginning percentage, dual Bt gene', price: '₹950/packet' },
    ],
    fertilizers: [
      { name: 'SSP (Single Super Phosphate)', description: 'Provides Phosphorus + Sulphur + Calcium', price: '₹560/bag' },
      { name: 'Urea (46% N)', description: 'Apply in 4 splits at 30, 60, 90, and 120 DAS', price: '₹267/bag' },
      { name: 'Magnesium Sulphate', description: 'Foliar spray to prevent reddening of leaves', price: '₹380/kg' },
    ],
    tips: 'Sowing: May-June. Maintain 90cm x 60cm spacing. Regular scouting for sucking pests in early stages.',
  },
  soybean: {
    seeds: [
      { name: 'JS-335 Soybean', description: 'Most popular variety, 95-100 days maturity', price: '₹180/kg' },
      { name: 'JS-9560 Soybean', description: 'High oil content, resistant to pod shattering', price: '₹220/kg' },
      { name: 'NRC-86 Soybean', description: 'Early maturing, suitable for late sowing', price: '₹200/kg' },
    ],
    fertilizers: [
      { name: 'Rhizobium Culture', description: 'Seed treatment for nitrogen fixation', price: '₹50/packet' },
      { name: 'SSP (Single Super Phosphate)', description: 'Apply 350 kg/hectare at sowing', price: '₹560/bag' },
      { name: 'Sulphur 90% WDG', description: 'Essential for oil crops, 20 kg/hectare', price: '₹420/kg' },
    ],
    tips: 'Inoculate seeds with Rhizobium before sowing. Sow in June with onset of monsoon. Avoid waterlogging.',
  },
  potato: {
    seeds: [
      { name: 'Kufri Jyoti Seed Potato', description: 'Medium maturing, white flesh, versatile cooking', price: '₹45/kg' },
      { name: 'Kufri Pukhraj', description: 'Early maturing, yellow flesh, high yielding', price: '₹50/kg' },
      { name: 'Kufri Badshah', description: 'Late blight tolerant, good for chips', price: '₹55/kg' },
    ],
    fertilizers: [
      { name: 'NPK 12-32-16', description: 'Basal application, promotes root and tuber growth', price: '₹1,500/bag' },
      { name: 'Potash (MOP)', description: 'Critical for tuber bulking, 150 kg/hectare', price: '₹870/bag' },
      { name: 'Calcium Ammonium Nitrate', description: 'Top-dress at earthing-up stage', price: '₹780/bag' },
    ],
    tips: 'Plant whole or cut tubers with 2-3 eyes. Ridge planting at 60cm x 20cm. Earth up at 30 and 45 days.',
  },
  onion: {
    seeds: [
      { name: 'Agrifound Dark Red', description: 'Kharif variety, dark red color, pungent', price: '₹2,800/kg' },
      { name: 'Pusa Ridhi', description: 'Rabi variety, light red, good storage quality', price: '₹3,200/kg' },
      { name: 'Arka Kalyan', description: 'Rabi season, rose pink, globe shaped', price: '₹2,600/kg' },
    ],
    fertilizers: [
      { name: 'NPK 15-15-15', description: 'Balanced nutrition at transplanting', price: '₹1,400/bag' },
      { name: 'Sulphur 90% WDG', description: 'Enhances pungency and storage quality', price: '₹420/kg' },
      { name: 'Humic Acid', description: 'Improves soil health and root development', price: '₹650/liter' },
    ],
    tips: 'Transplant 45-day old seedlings. Spacing: 15cm x 10cm. Stop irrigation 10 days before harvesting for better storage.',
  },
  sugarcane: {
    seeds: [
      { name: 'Co-0238 Sugarcane Setts', description: 'High sucrose content, early maturing', price: '₹350/quintal' },
      { name: 'CoJ-64 Sugarcane', description: 'Thick cane, suitable for jaggery making', price: '₹380/quintal' },
      { name: 'Co-86032', description: 'Mid-late maturity, high sugar recovery', price: '₹360/quintal' },
    ],
    fertilizers: [
      { name: 'Urea (46% N)', description: 'Heavy feeder - apply 300 kg N/hectare in splits', price: '₹267/bag' },
      { name: 'SSP + MOP mixture', description: 'Apply 150 kg P₂O₅ + 60 kg K₂O at planting', price: '₹1,400/combo' },
      { name: 'FeSO₄ (Ferrous Sulphate)', description: 'Corrects iron deficiency, foliar spray', price: '₹280/kg' },
    ],
    tips: 'Plant 2-3 budded setts in February-March. Earthing up at 90 and 120 days. Trash mulching conserves moisture.',
  },
  chilli: {
    seeds: [
      { name: 'Pusa Jwala Chilli Seeds', description: 'Hot variety, elongated wrinkled fruits', price: '₹3,500/kg' },
      { name: 'LCA-334 Chilli', description: 'Guntur type, suitable for dry chilli', price: '₹4,200/kg' },
      { name: 'Teja (S-17) Chilli', description: 'Highly pungent, exported variety', price: '₹3,800/kg' },
    ],
    fertilizers: [
      { name: 'NPK 19-19-19', description: 'Drip fertigation schedule every 3 days', price: '₹1,650/bag' },
      { name: 'Calcium Nitrate', description: 'Prevents fruit cracking and blossom drop', price: '₹980/bag' },
      { name: 'Neem Cake', description: 'Organic soil amendment, pest deterrent', price: '₹25/kg' },
    ],
    tips: 'Transplant 35-day old seedlings. Use mulching to conserve moisture. Spray Boron at flowering for better fruit set.',
  },
  mustard: {
    seeds: [
      { name: 'Pusa Bold Mustard', description: 'Bold seeded, high oil content (40%)', price: '₹180/kg' },
      { name: 'RH-749 Mustard', description: 'Suitable for rainfed conditions', price: '₹160/kg' },
      { name: 'NRCHB-101 Mustard', description: 'Canola quality, low erucic acid', price: '₹200/kg' },
    ],
    fertilizers: [
      { name: 'Sulphur 90% WDG', description: 'Critical for oilseeds, 40 kg/hectare', price: '₹420/kg' },
      { name: 'DAP', description: 'Apply 80 kg/hectare at sowing', price: '₹1,350/bag' },
      { name: 'Borax', description: 'Foliar spray at flowering stage', price: '₹180/kg' },
    ],
    tips: 'Sow in October. Thin plants at 15 days to maintain spacing. One irrigation at flowering is critical for rainfed crop.',
  },
  groundnut: {
    seeds: [
      { name: 'TAG-24 Groundnut', description: 'Bunch type, 110 days maturity', price: '₹120/kg' },
      { name: 'TG-37A Groundnut', description: 'Bold kernel, high oil content', price: '₹140/kg' },
      { name: 'GPBD-4 Groundnut', description: 'Foliar disease resistant, spreading type', price: '₹130/kg' },
    ],
    fertilizers: [
      { name: 'Gypsum', description: 'Apply 500 kg/hectare at pegging for pod development', price: '₹8/kg' },
      { name: 'SSP (Single Super Phosphate)', description: 'Basal dose 250 kg/hectare', price: '₹560/bag' },
      { name: 'Rhizobium + PSB Culture', description: 'Dual inoculation for better nutrition', price: '₹60/packet' },
    ],
    tips: 'Treat seeds with Thiram before sowing. Apply gypsum at 40-45 days (pegging stage). Light earthing up at 35 DAS.',
  },
  mango: {
    seeds: [
      { name: 'Alphonso Grafted Plant', description: 'Premium variety, king of mangoes', price: '₹350/plant' },
      { name: 'Kesar Grafted Plant', description: 'Gujarat specialty, excellent flavor', price: '₹280/plant' },
      { name: 'Dasheri Grafted Plant', description: 'North Indian favorite, aromatic', price: '₹250/plant' },
    ],
    fertilizers: [
      { name: 'NPK 10-26-26', description: 'Pre-flowering application in October', price: '₹1,450/bag' },
      { name: 'Organic Manure (Vermicompost)', description: 'Apply 50 kg/tree/year', price: '₹12/kg' },
      { name: 'Micronutrient Spray', description: 'Zn + B + Fe foliar spray post-harvest', price: '₹550/liter' },
    ],
    tips: 'Prune dead wood after harvest. Paclobutrazol application in September for regular bearing. Spray insecticide for hopper control.',
  },
  banana: {
    seeds: [
      { name: 'Grand Naine Tissue Culture', description: 'Cavendish type, high yielding', price: '₹25/plant' },
      { name: 'Robusta Tissue Culture', description: 'Tall variety, wind tolerant', price: '₹22/plant' },
      { name: 'Red Banana Sucker', description: 'Specialty variety, premium market price', price: '₹35/sucker' },
    ],
    fertilizers: [
      { name: 'Urea + MOP Mixture', description: 'Apply 200g N + 300g K₂O/plant in 6 splits', price: '₹1,200/combo' },
      { name: 'Calcium Ammonium Nitrate', description: 'Reduces pseudostem splitting', price: '₹780/bag' },
      { name: 'Magnesium Sulphate', description: 'Prevents yellowing of older leaves', price: '₹380/kg' },
    ],
    tips: 'Plant in pits 45cm x 45cm x 45cm. Desuckering monthly. Propping at bunch emergence. 10-12 months crop cycle.',
  },
  cabbage: {
    seeds: [
      { name: 'Golden Acre Cabbage', description: 'Round headed, early maturing (60 days)', price: '₹1,500/kg' },
      { name: 'Pride of India Cabbage', description: 'Flat round, suitable for processing', price: '₹1,800/kg' },
      { name: 'Green Express F1', description: 'Compact hybrid, uniform heads', price: '₹2,200/100g' },
    ],
    fertilizers: [
      { name: 'NPK 15-15-15', description: 'Basal + top-dressing at 30 DAS', price: '₹1,400/bag' },
      { name: 'Boron 20%', description: 'Prevents hollow stem and browning', price: '₹350/kg' },
      { name: 'Calcium Nitrate', description: 'Prevents tip burn, weekly application', price: '₹980/bag' },
    ],
    tips: 'Transplant 4-week old seedlings at 45cm x 45cm. Consistent watering prevents head splitting. Apply Trichoderma for clubroot prevention.',
  },
};

// Aliases and variations mapping
const cropAliases = {
  maize: 'corn',
  paddy: 'rice',
  'basmati': 'rice',
  'dhan': 'rice',
  'gehu': 'wheat',
  'gehun': 'wheat',
  'makka': 'corn',
  'tamatar': 'tomato',
  'aloo': 'potato',
  'pyaaz': 'onion',
  'pyaz': 'onion',
  'ganna': 'sugarcane',
  'mirch': 'chilli',
  'mirchi': 'chilli',
  'pepper': 'chilli',
  'sarson': 'mustard',
  'moongfali': 'groundnut',
  'peanut': 'groundnut',
  'aam': 'mango',
  'kela': 'banana',
  'patta gobhi': 'cabbage',
  'gobhi': 'cabbage',
  'soya': 'soybean',
  'soy': 'soybean',
  'kapas': 'cotton',
};

function getCropRecommendations(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Check for greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'namaste'];
  if (greetings.some((g) => message === g || message.startsWith(g + ' '))) {
    return {
      type: 'greeting',
      message:
        '🌾 Namaste! Welcome to Seed & Fertilizer Assistant!\n\nI can help you find the best seeds and fertilizers for your crops. Just tell me the crop name and I\'ll recommend the best products.\n\nAvailable crops: ' +
        Object.keys(cropDatabase).join(', ') +
        '\n\nExample: Type "wheat" or "rice" to get recommendations.',
    };
  }

  // Check for help
  if (message === 'help' || message === '?' || message.includes('what can you do')) {
    return {
      type: 'help',
      message:
        '🌱 I can recommend seeds and fertilizers for these crops:\n\n' +
        Object.keys(cropDatabase)
          .map((c) => `• ${c.charAt(0).toUpperCase() + c.slice(1)}`)
          .join('\n') +
        '\n\nJust type the crop name and I\'ll provide recommendations with prices and growing tips!',
    };
  }

  // Find matching crop
  let cropName = null;

  // Direct match
  for (const crop of Object.keys(cropDatabase)) {
    if (message.includes(crop)) {
      cropName = crop;
      break;
    }
  }

  // Alias match
  if (!cropName) {
    for (const [alias, crop] of Object.entries(cropAliases)) {
      if (message.includes(alias)) {
        cropName = crop;
        break;
      }
    }
  }

  if (cropName) {
    const data = cropDatabase[cropName];
    const displayName = cropName.charAt(0).toUpperCase() + cropName.slice(1);

    let response = `🌾 **Recommendations for ${displayName}**\n\n`;

    response += `🌱 **Recommended Seeds:**\n`;
    data.seeds.forEach((s, i) => {
      response += `${i + 1}. **${s.name}** — ${s.price}\n   ${s.description}\n`;
    });

    response += `\n🧪 **Recommended Fertilizers:**\n`;
    data.fertilizers.forEach((f, i) => {
      response += `${i + 1}. **${f.name}** — ${f.price}\n   ${f.description}\n`;
    });

    response += `\n💡 **Growing Tips:**\n${data.tips}`;

    return {
      type: 'recommendation',
      crop: cropName,
      message: response,
      seeds: data.seeds,
      fertilizers: data.fertilizers,
      tips: data.tips,
    };
  }

  // No match found
  return {
    type: 'unknown',
    message:
      '🤔 I couldn\'t identify the crop you mentioned. Please try one of these crops:\n\n' +
      Object.keys(cropDatabase)
        .map((c) => `• ${c.charAt(0).toUpperCase() + c.slice(1)}`)
        .join('\n') +
      '\n\nYou can also try Hindi names like "gehu", "dhan", "aloo", etc.',
  };
}

module.exports = { getCropRecommendations };
