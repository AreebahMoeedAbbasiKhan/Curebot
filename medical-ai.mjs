// CureBot Medical AI Engine - Zero Dependencies
// Custom TF-IDF + Naive Bayes implementation (no external libraries)

// ============================================================
// CUSTOM NLP UTILITIES
// ============================================================

// Simple tokenizer
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);
}

// Simple stemmer (Porter-like, simplified)
function stem(word) {
  return word
    .replace(/ing$/, '').replace(/tion$/, 't').replace(/sion$/, 's')
    .replace(/ness$/, '').replace(/ment$/, '').replace(/ful$/, '')
    .replace(/less$/, '').replace(/ous$/, '').replace(/ive$/, '')
    .replace(/ies$/, 'y').replace(/es$/, '').replace(/s$/, '');
}

// Stop words to ignore
const STOP_WORDS = new Set(['the','a','an','is','are','was','were','be','been',
  'being','have','has','had','do','does','did','will','would','could','should',
  'may','might','shall','can','need','dare','ought','used','to','of','in','for',
  'on','with','at','by','from','as','into','through','during','before','after',
  'above','below','between','out','off','over','under','again','further','then',
  'once','here','there','when','where','why','how','all','each','every','both',
  'few','more','most','other','some','such','no','nor','not','only','own','same',
  'so','than','too','very','just','because','but','and','or','if','while','about',
  'it','its','this','that','these','those','i','me','my','we','our','you','your',
  'he','him','his','she','her','they','them','their','what','which','who','whom']);

// ============================================================
// MEDICAL KNOWLEDGE BASE
// ============================================================

const MEDICAL_KNOWLEDGE = [
  { q: "what is diabetes type 1 type 2 blood sugar insulin", answer: "🩺 **Diabetes**\n\nDiabetes is a chronic condition where the body cannot properly process blood sugar (glucose).\n\n**Types:**\n• Type 1: Body doesn't produce insulin (autoimmune)\n• Type 2: Body doesn't use insulin properly (most common, 90%)\n• Gestational: Develops during pregnancy\n\n**Symptoms:** Frequent urination, excessive thirst, unexplained weight loss, fatigue, blurred vision\n\n**Management:** Diet control, exercise, medication (Metformin), insulin injections\n\n**Tests:** Fasting blood sugar, HbA1c, Oral glucose tolerance test\n\n👉 Want to book a blood sugar test? Say \"book lab test\"" },
  { q: "what is hypertension high blood pressure bp", answer: "🩺 **Hypertension (High Blood Pressure)**\n\nBlood pressure consistently above 140/90 mmHg.\n\n**Causes:** Obesity, high salt intake, stress, genetics, lack of exercise\n\n**Symptoms:** Often none (\"silent killer\"), headaches, dizziness, nosebleeds in severe cases\n\n**Risks:** Heart attack, stroke, kidney damage, vision loss\n\n**Management:**\n• Reduce salt intake\n• Exercise 30 min daily\n• Maintain healthy weight\n• Medication if prescribed\n• Monitor BP regularly\n\n**Normal BP:** Below 120/80 mmHg\n\n👉 Want to find a cardiologist? Say \"find cardiologist\"" },
  { q: "what is asthma breathing lungs inhaler wheeze", answer: "🩺 **Asthma**\n\nA chronic lung condition causing airway inflammation and narrowing.\n\n**Triggers:** Dust, pollen, cold air, exercise, smoke, stress\n\n**Symptoms:** Wheezing, shortness of breath, chest tightness, coughing (especially at night)\n\n**Treatment:**\n• Reliever inhaler (blue) for attacks\n• Preventer inhaler (brown/orange) daily\n• Avoid triggers\n• Action plan from doctor\n\n⚠️ Severe attack? Call 1122 immediately.\n\n👉 Want to find a pulmonologist? Say \"find doctor\"" },
  { q: "what is dengue fever mosquito platelet", answer: "🩺 **Dengue Fever**\n\nA mosquito-borne viral infection common in Lahore during monsoon season.\n\n**Symptoms:** High fever, severe headache, pain behind eyes, joint/muscle pain, rash, nausea\n\n**Warning Signs (go to ER):** Severe abdominal pain, persistent vomiting, bleeding gums, blood in vomit/stool\n\n**Treatment:**\n• No specific antiviral — supportive care\n• Paracetamol for fever (NOT ibuprofen/aspirin)\n• Drink plenty of fluids/ORS\n• Rest & monitor platelet count\n\n**Prevention:** Mosquito repellent, no standing water, nets\n\n👉 Book a dengue test: Say \"book lab test dengue\"" },
  { q: "what is covid coronavirus covid19 sars", answer: "🩺 **COVID-19**\n\nRespiratory illness caused by SARS-CoV-2 virus.\n\n**Symptoms:** Fever, cough, fatigue, loss of taste/smell, body aches, sore throat\n\n**When to seek emergency care:** Difficulty breathing, persistent chest pain, confusion, bluish lips\n\n**Prevention:** Vaccination, hand washing, masks in crowded places\n\n**Treatment:** Rest, fluids, paracetamol. Antivirals for high-risk patients.\n\n👉 Book a COVID test: Say \"book lab test\"" },
  { q: "what is thyroid hypothyroidism hyperthyroidism tsh", answer: "🩺 **Thyroid Disorders**\n\n**Hypothyroidism (underactive):**\nSymptoms: Fatigue, weight gain, cold sensitivity, dry skin, depression\nTreatment: Levothyroxine (daily tablet)\n\n**Hyperthyroidism (overactive):**\nSymptoms: Weight loss, rapid heartbeat, anxiety, tremors, heat sensitivity\nTreatment: Anti-thyroid medication, radioiodine, surgery\n\n**Tests:** TSH, T3, T4 blood tests\n\n👉 Book thyroid test: Say \"book lab test thyroid\"" },
  { q: "what is anemia iron deficiency hemoglobin low blood", answer: "🩺 **Anemia**\n\nLow red blood cells or hemoglobin, reducing oxygen delivery to body.\n\n**Symptoms:** Fatigue, weakness, pale skin, dizziness, cold hands/feet, shortness of breath\n\n**Causes:** Iron deficiency (most common), vitamin B12 deficiency, chronic disease, blood loss\n\n**Treatment:**\n• Iron supplements (with vitamin C for absorption)\n• Iron-rich foods: spinach, red meat, lentils, eggs\n• Treat underlying cause\n\n**Tests:** CBC, Iron studies, Ferritin\n\n👉 Book a CBC test: Say \"book lab test cbc\"" },
  { q: "what is migraine severe headache one side aura", answer: "🩺 **Migraine**\n\nA neurological condition causing intense, throbbing headaches.\n\n**Symptoms:** Severe one-sided headache, nausea, sensitivity to light/sound, visual aura\n\n**Triggers:** Stress, lack of sleep, certain foods (cheese, chocolate), hormonal changes, bright lights\n\n**Treatment:**\n• Pain relief: Paracetamol + Ibuprofen early\n• Triptans (prescription) for severe attacks\n• Rest in dark, quiet room\n• Preventive medication if frequent\n\n👉 Want to see a neurologist? Say \"find neurologist\"" },
  { q: "what is depression anxiety mental health stress sad", answer: "🩺 **Depression & Anxiety**\n\n**Depression symptoms:** Persistent sadness, loss of interest, fatigue, sleep changes, hopelessness\n\n**Anxiety symptoms:** Excessive worry, restlessness, rapid heartbeat, difficulty sleeping, muscle tension\n\n**When to seek help:** If symptoms last 2+ weeks or affect daily life\n\n**Treatment:**\n• Therapy (CBT is very effective)\n• Medication (SSRIs) if needed\n• Exercise, sleep hygiene, social support\n• Mindfulness and relaxation techniques\n\n⚠️ If having thoughts of self-harm, call 0311-7786264 (Umang helpline)\n\n👉 Find a psychiatrist: Say \"find psychiatrist\"" },
  { q: "what is kidney disease renal failure creatinine", answer: "🩺 **Kidney Disease**\n\nKidneys filter waste from blood. Disease means they can't do this properly.\n\n**Causes:** Diabetes, high BP, infections, genetic conditions\n\n**Symptoms (often late):** Swelling (face/legs), fatigue, foamy urine, blood in urine, back pain\n\n**Prevention:**\n• Control diabetes and BP\n• Stay hydrated\n• Limit salt and painkillers\n• Regular checkups\n\n**Tests:** RFT (Renal Function Test), Urine DR, Creatinine\n\n👉 Book kidney test: Say \"book lab test rft\"" },
  { q: "how to lose weight diet exercise obesity fat", answer: "⚖️ **Healthy Weight Loss**\n\n**Safe rate:** 0.5-1 kg per week\n\n**Diet tips:**\n• Eat more vegetables, fruits, whole grains\n• Reduce sugar, fried foods, processed snacks\n• Control portion sizes\n• Don't skip breakfast\n• Drink water before meals\n\n**Exercise:**\n• 30 min brisk walking daily\n• Gradually increase intensity\n• Mix cardio + strength training\n• Be consistent, not extreme\n\n**Avoid:** Crash diets, diet pills, skipping meals\n\n👉 Want to see a nutritionist? Say \"find doctor general medicine\"" },
  { q: "how to sleep better insomnia sleep problems night", answer: "😴 **Better Sleep Guide**\n\n**Sleep hygiene tips:**\n• Fixed sleep/wake time (even weekends)\n• No screens 1 hour before bed\n• Cool, dark, quiet room\n• No caffeine after 2 PM\n• Exercise (but not close to bedtime)\n• Avoid heavy meals at night\n\n**Relaxation:**\n• Deep breathing (4-7-8 technique)\n• Warm bath before bed\n• Reading (not on phone)\n\n**See a doctor if:**\n• Can't sleep for 3+ weeks\n• Snoring with breathing pauses\n• Excessive daytime sleepiness\n\n**Recommended sleep:** 7-9 hours for adults" },
  { q: "what is normal blood pressure heart rate pulse vital signs", answer: "📊 **Normal Vital Signs**\n\n**Blood Pressure:**\n• Normal: Below 120/80 mmHg\n• Elevated: 120-129 / <80\n• High (Stage 1): 130-139 / 80-89\n• High (Stage 2): 140+ / 90+\n• Crisis: 180+ / 120+ (call 1122!)\n\n**Heart Rate:**\n• Normal resting: 60-100 bpm\n• Athletes: 40-60 bpm\n\n**Temperature:**\n• Normal: 97-99°F (36.1-37.2°C)\n• Fever: Above 100.4°F (38°C)\n\n**Oxygen (SpO2):**\n• Normal: 95-100%\n• Concerning: Below 92%" },
  { q: "pregnancy prenatal care pregnant baby trimester", answer: "🤰 **Pregnancy Care Guide**\n\n**First trimester (1-12 weeks):**\n• Start folic acid immediately\n• First ultrasound at 8-12 weeks\n• Avoid raw meat, unpasteurized dairy\n• Morning sickness is normal\n\n**Important tests:**\n• Blood group, CBC, Sugar\n• Hepatitis B & C\n• Monthly ultrasounds\n\n**Warning signs (go to ER):**\n• Heavy bleeding\n• Severe abdominal pain\n• High fever\n• Severe headache with vision changes\n\n👉 Find a gynecologist: Say \"find gynecologist\"" },
  { q: "vaccination vaccine immunization schedule shots", answer: "💉 **Vaccination Info**\n\n**Children (EPI Pakistan):**\n• Birth: BCG, OPV, Hep B\n• 6 weeks: Pentavalent, OPV, PCV\n• 10 weeks: Pentavalent, OPV, PCV\n• 14 weeks: Pentavalent, OPV, PCV, IPV\n• 9 months: Measles, Vitamin A\n• 15 months: Measles 2nd dose\n\n**Adults:**\n• Flu vaccine (yearly)\n• COVID boosters\n• Hepatitis B (if not immune)\n• Tetanus (every 10 years)\n\n👉 Find a pediatrician: Say \"find pediatrician\"" },
  { q: "how much water drink daily hydration dehydration", answer: "💧 **Daily Water Intake**\n\n**Recommended:** 8-10 glasses (2-2.5 liters) per day\n\n**More needed if:**\n• Hot weather (Lahore summers!)\n• Exercise/physical work\n• Fever or illness\n• Breastfeeding\n\n**Signs of dehydration:**\n• Dark yellow urine\n• Dry mouth\n• Headache\n• Dizziness\n\n**Tips:**\n• Keep a water bottle with you\n• Drink before you feel thirsty\n• Eat water-rich fruits (watermelon, cucumber)\n• Limit tea/coffee (they dehydrate)" },
  { q: "what is cancer tumor malignant oncology", answer: "🩺 **Cancer Overview**\n\n**What is it:** Uncontrolled cell growth that can spread to other parts of the body.\n\n**Warning signs:**\n• Unexplained weight loss\n• Persistent fatigue\n• Lump or thickening\n• Changes in skin/moles\n• Persistent cough or hoarseness\n• Blood in stool/urine\n\n**Prevention:**\n• Don't smoke\n• Healthy diet & exercise\n• Limit alcohol\n• Sun protection\n• Regular screenings\n\n**In Lahore:** Shaukat Khanum Hospital is a leading cancer center.\n\n👉 Say \"find oncologist\" or \"Shaukat Khanum\" for more info." },
  { q: "what is cholesterol ldl hdl triglycerides lipid", answer: "🩺 **Cholesterol**\n\n**Types:**\n• LDL (bad): Builds up in arteries → heart disease\n• HDL (good): Removes cholesterol from arteries\n• Triglycerides: Fat in blood from food\n\n**Normal levels:**\n• Total: Below 200 mg/dL\n• LDL: Below 100 mg/dL\n• HDL: Above 40 (men), 50 (women)\n• Triglycerides: Below 150 mg/dL\n\n**How to improve:**\n• Reduce fried/fatty foods\n• Exercise 30 min daily\n• Eat oats, nuts, fish\n• Quit smoking\n• Medication (statins) if needed\n\n👉 Book lipid profile: Say \"book lab test lipid profile\"" },
  { q: "what is pneumonia lung infection chest cough phlegm", answer: "🩺 **Pneumonia**\n\nInfection that inflames air sacs in lungs.\n\n**Symptoms:** Cough with phlegm, fever, chills, difficulty breathing, chest pain when breathing\n\n**Causes:** Bacteria, viruses, fungi\n\n**Treatment:**\n• Antibiotics (if bacterial)\n• Rest and fluids\n• Fever medication\n• Hospitalization if severe\n\n**See a doctor if:** High fever, difficulty breathing, chest pain, coughing blood\n\n👉 Find a pulmonologist: Say \"find doctor\"" },
  { q: "what is hepatitis liver jaundice hep b hep c", answer: "🩺 **Hepatitis**\n\nLiver inflammation, usually caused by viruses.\n\n**Types:**\n• Hep A: Contaminated food/water (usually resolves)\n• Hep B: Blood/body fluids (vaccine available)\n• Hep C: Blood contact (curable with medication)\n\n**Symptoms:** Fatigue, nausea, abdominal pain, dark urine, jaundice (yellow skin/eyes)\n\n**Prevention:**\n• Hep B vaccination\n• Safe blood transfusions\n• Don't share needles/razors\n• Clean water and food\n\n👉 Book hepatitis test: Say \"book lab test hepatitis\"" },
];

// ============================================================
// CUSTOM TF-IDF IMPLEMENTATION
// ============================================================

// Build document index
const docTokens = MEDICAL_KNOWLEDGE.map(item => {
  const tokens = tokenize(item.q).filter(w => !STOP_WORDS.has(w)).map(stem);
  return new Set(tokens);
});

// IDF scores
const idfScores = {};
const N = MEDICAL_KNOWLEDGE.length;
const allTerms = new Set();
docTokens.forEach(doc => doc.forEach(t => allTerms.add(t)));
allTerms.forEach(term => {
  const docsWithTerm = docTokens.filter(doc => doc.has(term)).length;
  idfScores[term] = Math.log((N + 1) / (docsWithTerm + 1)) + 1;
});

// ============================================================
// NAIVE BAYES CLASSIFIER (custom implementation)
// ============================================================

const categories = { medical: {}, service: {}, greeting: {} };
const categoryCounts = { medical: 0, service: 0, greeting: 0 };
const vocabSize = { total: new Set() };

const trainingData = [
  // Medical
  ...["diabetes","blood pressure","hypertension","asthma","dengue","covid","thyroid",
  "anemia","migraine","depression","anxiety","kidney","pregnancy","vaccine","cholesterol",
  "cancer","infection","allergy","pneumonia","malaria","hepatitis","fever","headache",
  "cough","pain","nausea","vomiting","diarrhea","rash","fatigue","dizziness",
  "weight loss","lose weight","gain weight","diet","nutrition","sleep","insomnia",
  "exercise","immunity","vitamin","blood sugar","heart rate","side effect","treatment",
  "cure","remedy","symptom","medicine","medication","dose","tablet","injection",
  "what is","what causes","how to reduce","how to lower","how to improve",
  "how to control","how to prevent","how to treat","how to stop","is it safe",
  "signs of","risk of","home remedy","first aid","burn","choking","bleeding",
  "fracture","seizure","fainting","normal range","health question"].map(t => ({ text: t, cat: "medical" })),
  // Service
  ...["book appointment","find doctor","hospitals","book lab test","emergency contacts",
  "find labs","schedule appointment","show hospitals","find specialist","book checkup",
  "nearest hospital","lab near me","doctor available"].map(t => ({ text: t, cat: "service" })),
  // Greeting
  ...["hi","hello","hey","salam","good morning","good evening","thanks","thank you",
  "bye","goodbye","assalam","aoa"].map(t => ({ text: t, cat: "greeting" })),
];

// Train
trainingData.forEach(({ text, cat }) => {
  const words = tokenize(text);
  categoryCounts[cat]++;
  words.forEach(w => {
    categories[cat][w] = (categories[cat][w] || 0) + 1;
    vocabSize.total.add(w);
  });
});

function classifyText(text) {
  const words = tokenize(text).filter(w => !STOP_WORDS.has(w));
  const totalDocs = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const V = vocabSize.total.size;
  const scores = {};

  for (const cat of Object.keys(categories)) {
    const catWordCount = Object.values(categories[cat]).reduce((a, b) => a + b, 0);
    let logProb = Math.log(categoryCounts[cat] / totalDocs);
    for (const w of words) {
      const wordCount = categories[cat][w] || 0;
      logProb += Math.log((wordCount + 1) / (catWordCount + V)); // Laplace smoothing
    }
    scores[cat] = logProb;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[0];
}

// ============================================================
// SEARCH FUNCTION
// ============================================================

function cosineSimilarity(queryTokens, docIdx) {
  const docSet = docTokens[docIdx];
  let score = 0;
  for (const token of queryTokens) {
    if (docSet.has(token)) {
      score += (idfScores[token] || 1);
    }
  }
  // Normalize by query length
  return score / Math.max(queryTokens.length, 1);
}

export function findAnswer(query) {
  const queryLower = query.toLowerCase();
  const tokens = tokenize(queryLower).filter(w => !STOP_WORDS.has(w));
  const stemmedTokens = tokens.map(stem);

  // If query is too vague/generic, ask for specifics
  const vaguePatterns = ['health issue','health issues','health problem','health problems',
    'medical issue','medical problem','i am sick','i am ill','not feeling well',
    'feeling sick','feeling unwell','health question','medical question',
    'i have a health','i have a problem','something wrong','not well'];
  for (const vp of vaguePatterns) {
    if (queryLower.includes(vp)) {
      return `🩺 **I'd be happy to help!**\n\nPlease tell me more specifically:\n\n• **What symptoms do you have?** (e.g., headache, fever, chest pain)\n• **What condition do you want to know about?** (e.g., diabetes, asthma)\n• **What medicine do you need info on?** (e.g., paracetamol)\n\n**Common topics I can help with:**\n• Diabetes, Blood Pressure, Asthma, Dengue, COVID\n• Thyroid, Anemia, Migraine, Depression, Kidney Disease\n• Weight loss, Sleep problems, Pregnancy, Vaccination\n• Cholesterol, Cancer, Pneumonia, Hepatitis\n\n👉 Just describe what you're experiencing or ask about any condition!`;
    }
  }

  // Score each document
  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < MEDICAL_KNOWLEDGE.length; i++) {
    // TF-IDF cosine similarity
    const tfidfScore = cosineSimilarity(stemmedTokens, i);

    // Direct keyword overlap (unstemmed)
    const docWords = tokenize(MEDICAL_KNOWLEDGE[i].q);
    const overlap = tokens.filter(t => docWords.includes(t)).length;
    const overlapScore = overlap / Math.max(tokens.length, 1);

    // Combined score
    const combined = (tfidfScore * 0.6) + (overlapScore * 0.4);

    if (combined > bestScore) {
      bestScore = combined;
      bestIdx = i;
    }
  }

  if (bestIdx >= 0 && bestScore >= 0.2) {
    return MEDICAL_KNOWLEDGE[bestIdx].answer;
  }

  // Fallback: general medical response
  return `🩺 **Health Question**\n\nI don't have a specific answer for that yet, but I can help with:\n\n• **Conditions:** Diabetes, Hypertension, Asthma, Dengue, COVID, Thyroid, Anemia, Migraine, Depression, Kidney Disease, Cancer, Cholesterol, Pneumonia, Hepatitis\n• **General:** Weight loss, Sleep, Water intake, Pregnancy, Vaccination, Vital signs\n• **Symptoms:** Say "I have [symptom]"\n• **Medicine:** Say "medicine [name]"\n• **First Aid:** Say "burn", "choking", "bleeding"\n\n⚠️ For specific medical advice, please consult a doctor.\n\n👉 Want to book a doctor? Say "book appointment"`;
}

export function isMedicalQuestion(message) {
  const msg = message.toLowerCase().trim();

  // Skip very short messages (likely greetings/commands)
  if (msg.split(/\s+/).length <= 2) {
    // Only match if it's a clear medical term OR a vague health query
    const shortMedTerms = ['diabetes','hypertension','asthma','dengue','covid',
      'thyroid','anemia','migraine','depression','pneumonia','hepatitis',
      'cholesterol','cancer','malaria','insomnia','dehydration',
      'health issues','health issue','health problem','health problems'];
    return shortMedTerms.some(t => msg.includes(t));
  }

  // Skip obvious service/greeting patterns
  if (msg.match(/^(hi|hello|hey|salam|assalam|aoa|good morning|good evening|thanks|thank you|bye)/)) return false;
  if (msg.match(/\b(book|schedule|find doctor|find hospital|find lab|hospitals|labs|emergency|appointment)\b/)) return false;

  // Skip vague health queries (let findAnswer handle them with a prompt)
  if (msg.match(/^(health issue|health issues|health problem|health problems|medical issue|i have a health|health question|i am sick|not feeling well|feeling sick)/)) return true;

  // Keyword detection
  const medicalKeywords = [
    'diabetes','blood pressure','hypertension','asthma','dengue','covid',
    'thyroid','anemia','migraine','depression','anxiety','kidney disease',
    'pregnancy','vaccine','vaccination','cholesterol','cancer','tumor',
    'infection','allergy','pneumonia','malaria','hepatitis',
    'weight loss','lose weight','gain weight','diet plan','nutrition',
    'sleep better','insomnia','immunity','vitamin',
    'blood sugar','heart rate','normal range','side effect',
    'treatment for','cure for','remedy for','cause of','causes of',
    'how to reduce','how to lower','how to improve','how to control',
    'how to prevent','how to treat','how to stop','is it safe',
    'symptoms of','signs of','risk of','home remedy','first aid',
    'what is diabetes','what is asthma','what is cancer','what is dengue',
    'what is thyroid','what is anemia','what is cholesterol','what is hepatitis',
  ];

  for (const kw of medicalKeywords) {
    if (msg.includes(kw)) return true;
  }

  // Classifier fallback (only for longer messages)
  if (msg.split(/\s+/).length >= 3) {
    return classifyText(msg) === 'medical';
  }

  return false;
}
