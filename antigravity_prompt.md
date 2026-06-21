# PROMPT: "Between Obstruction and Loss" — Interactive Medical Case Report Website

---

## OVERVIEW

Build a **fully interactive, single-page medical case report website** titled **"Between Obstruction and Loss"** — a rare obstetric–surgical emergency case report about midgut volvulus with cervical incompetence at 20 weeks gestation. This is a **conference-grade educational tool** for clinicians, with a clean, premium medical journal aesthetic. Every section must be polished, functional, and medically accurate.

---

## DESIGN SYSTEM

### Typography
- **Display / Headings:** `Instrument Serif` (Google Fonts) — italic for emphasis words
- **Body / UI:** `Inter` (Google Fonts) — weights 300, 400, 500, 600
- **Code / Cite:** `JetBrains Mono` (Google Fonts) — for citation footer only

### Color Palette
```
--teal:        #0F6E56   (primary action color, confirmed states, accents)
--teal-light:  #E1F5EE   (backgrounds for teal states)
--teal-mid:    #1D9E75   (hover states, progress fills)
--teal-dark:   #085041   (hover darken)
--navy:        #0C2340   (headings, primary buttons, section numbers)
--navy-mid:    #1a3a5c   (secondary navy uses)
--slate:       #4A5568   (body text secondary)
--slate-light: #718096   (muted text, labels)
--red:         #A32D2D   (red flags, excluded states, danger)
--red-light:   #FCEBEB   (red flag backgrounds)
--amber:       #854F0B   (warnings, cervical findings)
--amber-mid:   #EF9F27   (amber accents, amber dots)
--amber-light: #FAEEDA   (amber backgrounds)
--purple-light:#EDE9FE   (co-existing pathology badge bg)
--purple-dark: #4C1D95   (co-existing pathology badge text)
--surface:     #F8F9FA   (page background for cards)
--surface-2:   #EEF0F3   (deeper surface)
--border:      rgba(0,0,0,0.08)
--border-strong: rgba(0,0,0,0.15)
--white:       #ffffff
```

### Global Rules
- Sticky navigation bar, 56px height, frosted glass (backdrop-filter: blur)
- Max content width: **900px**, centered
- Section padding: 4rem 2rem
- All sections separated by a 0.5px border
- Scroll-reveal animations (opacity + translateY) on all sections
- Smooth scroll between sections
- Mobile responsive down to 375px
- NO dark mode required
- NO decorative gradients or heavy shadows — flat, clean surfaces
- Border radius: 8px for cards, 4px for badges/buttons

---

## FIXED NAVIGATION BAR

Sticky top nav with:
- **Left:** Badge "CR" (teal pill) + "Case Report" label
- **Right:** Nav links to all sections: Patient | Findings | Diagnosis | Differentials | Surgery | Outcome | Quiz | AI Tutor | Leaderboard
- Font: 13px, uppercase letter-spacing for links

---

## HERO SECTION (Landing Page)

### What to INCLUDE:
- **Eyebrow badge:** "RARE OBSTETRIC–SURGICAL EMERGENCY · CASE REPORT · 2026" — small pill with teal border and dot
- **Main title** (Instrument Serif, ~84px, navy):
  ```
  Between
  Obstruction     ← "Obstruction" in italic teal
  and Loss
  ```
- **Subtitle** (Inter 300, 18px, slate): "A rare case of midgut volvulus with concurrent acute appendicitis and cervical incompetence at 20 weeks gestation."
- **Two CTA buttons:**
  - Primary (navy fill): "Begin the case →"
  - Secondary (outline): "⬡ Take the quiz"
- Both buttons link/scroll to their respective sections

### What to EXCLUDE from hero:
- ❌ NO author names (Dr. A. Mehta, Dr. R. Iyer, Dr. S. Khan) — remove completely
- ❌ NO hero/landing image — remove the anatomical illustration that appeared in the sample (it was flagged as medically incorrect). The page opens with typography only.
- ❌ NO "PRESENTED / Annual Conference · 2026" block

---

## CASE TIMELINE BAR

Horizontal scrollable timeline strip directly below hero, showing key milestones:

| Dot Color | Label | Sub-label |
|-----------|-------|-----------|
| Teal | 6 Weeks | Pregnancy confirmed |
| Amber | 11 Weeks | Enteric fever |
| Red | 20+1 Weeks | Acute abdomen & diagnosis |
| Red | 20+2 Weeks | Emergency Ladd's procedure |
| Amber | 22 Weeks | Cervical insufficiency & cerclage |
| Teal | 24+1 Weeks | Recovery & discharge |
| Teal | 37 Weeks | Live birth via LSCS |

Timeline dots connected by thin lines. Labels below each dot. Horizontally scrollable on mobile.

---

## SECTION 01 — PATIENT PROFILE

**Eyebrow:** "Section 01 · Patient Profile"
**Heading:** "A primigravida at 20 weeks presenting with the unexpected."

### Layout: 2-column grid

**Left card — Patient Identity:**
- Navy header block showing: Large "23/F", tag "PRIMIGRAVIDA"
- Below header, detail rows (label left, value right):
  - Gestation: 20 weeks + 1 day (teal)
  - Presenting: Acute abdominal pain (red)
  - Associated: Recurrent bilious vomiting (red)
  - P/V: Bleeding per vaginum (red)
  - Prior surgery: None
  - Comorbidities: None significant

**Right card — Symptom Progression:**
- Card header: "SYMPTOM PROGRESSION" (small caps, muted)
- Vertical timeline with dots connected by lines:
  - **Day −3** (teal): Mild epigastric discomfort, dismissed as gravid dyspepsia. No bilious component.
  - **Day −2** (teal): Onset of intermittent abdominal pain, worsening in periumbilical region.
  - **Day −1** (teal): Recurrent bilious vomiting with oral intolerance. Unable to keep any feeds down.
  - **Day 0 · 06:00** (red, critical): Sudden severe periumbilical pain. Bleeding per vaginum noted. Unable to stand.
  - **Day 0 · 14:00** (red, critical): Presented to emergency. Pallor, tachycardia, diffuse guarding. Fetal heart sounds: present and reassuring.

---

## SECTION 02 — CLINICAL PRESENTATION

**Eyebrow:** "Section 02 · Clinical Presentation"
**Heading:** "Six findings that demanded immediate action."

### Layout: 2×3 grid of finding cards

Each card has:
- A **circular SVG severity ring** (donut chart showing %) 
- Finding name (500 weight)
- Red flag badge (if applicable) — "▲ Red flag" in red

| Finding | Severity % | Red Flag? |
|---------|-----------|-----------|
| Progressive abdominal pain | 95% | ✓ Red flag |
| Recurrent bilious vomiting | 90% | ✓ Red flag |
| Abdominal tenderness with guarding | 90% | ✓ Red flag |
| Pallor (Hb 8.8 g/dL) | 75% | Moderate anaemia label |
| MRI-confirmed midgut volvulus | 100% | Confirmatory label (teal) |
| Absent cervical length with funnelling | 95% | ✓ Red flag |

Cards with red flags get a left border accent (3px, red). Severity ring stroke color: teal for most, amber for pallor.

---

## SECTION 03 — DIAGNOSTIC JOURNEY

**Eyebrow:** "Section 03 · Diagnostic Journey"
**Heading:** "From bedside to the unifying diagnosis — six investigative steps."

### Tab Navigation (6 clickable tabs):
Step 1: History | Step 2: Examination | Step 3: Laboratory | Step 4: Ultrasound | Step 5: MRI / CT | Step 6: Final Diagnosis

Each tab shows a different content panel below:

**Step 1 — History (2-column info blocks):**
- Clinical History: 23-year-old primigravida at 20+1 weeks; 2-day history of bilious vomiting and acute abdominal pain; pregnancy confirmed at 45 days amenorrhoea; enteric fever at 11 weeks treated conservatively; no prior surgery or comorbidities
- Key Flags: Bilious vomiting → proximal GI obstruction; Periumbilical pain → midgut pathology; Oral intolerance → complete obstruction; PV bleeding → concurrent obstetric complication

**Step 2 — Examination (2-column):**
- General & Abdominal: Conscious and oriented; Pallor + tachycardia; Diffuse tenderness with guarding maximal periumbilically; No peritonitis; Uterus 20 weeks size
- Obstetric: Fetal heart rate reassuring; Uterus corresponds to gestational age; PV minimal fresh bleeding; Cervix os open on digital examination

**Step 3 — Laboratory (table format):**
- Hb: 8.8 g/dL ↓ (moderate anaemia) — amber
- Serum potassium: 3.4 mmol/L ↓ (mild hypokalaemia) — amber
- WBC: Within limits — teal
- Serum amylase: Normal — teal
- Serum lipase: Normal — teal
- LFT, RFT: Normal — teal

**Step 4 — Ultrasound (2-column):**
- Abdominal USG: **Whirlpool sign** — mesenteric vessels swirling around SMA axis; Dilated bowel loops mid-abdomen; Gallbladder normal; Pancreas normal
- Obstetric USG: Single live intrauterine fetus at 20+1 weeks; Fetal cardiac activity present; Both ovaries normal; Placenta normal anterior

**Step 5 — MRI / CT (2-column):**
- MRI Findings: Whirlpool sign confirmed around SMA axis; Closed-loop obstruction of mid-jejunum; No frank bowel wall ischaemia; Malrotation with volvulus confirmed
- Cervical / Obstetric MRI: Cervical funnelling >50% length; Absent measurable cervical length with internal os funnelling; Consistent with cervical insufficiency; Single live intrauterine pregnancy viable

**Step 6 — Final Diagnosis:**
- Full-width navy dark card:
  - Small label: "FINAL DIAGNOSIS" (teal, uppercase)
  - Serif text: "Acute midgut volvulus secondary to congenital intestinal malrotation in a 20+1-week primigravida, successfully managed with emergency laparoscopic Ladd's procedure, followed by emergency McDonald cervical cerclage for cervical insufficiency."

---

## SECTION 04 — DIFFERENTIAL DIAGNOSIS

**Eyebrow:** "Section 04 · Differential Diagnosis"
**Heading:** "Reasoning through the acute abdomen in pregnancy."

### Full-width table with 3 columns: Diagnosis | Status Badge | Basis

| Differential Diagnosis | Status | Basis |
|------------------------|--------|-------|
| Midgut volvulus secondary to intestinal malrotation | **CONFIRMED** (teal badge) | MRI demonstrated malrotation with volvulus; confirmed intraoperatively during emergency laparoscopic Ladd's procedure. |
| Acute appendicitis | **CO-EXISTING PATHOLOGY** (purple badge) | Histopathology showed acute appendicitis with mucosal ulceration and neutrophilic infiltration following appendectomy; however, it did not explain the intestinal obstruction. |
| Acute cholecystitis | **EXCLUDED** (gray badge) | Abdominal ultrasound showed a normal gallbladder without calculi or wall thickening. |
| Acute pancreatitis | **EXCLUDED** (gray badge) | Pancreas appeared normal on ultrasound; serum amylase and lipase within normal limits. |
| Ovarian torsion | **EXCLUDED** (gray badge) | MRI demonstrated both ovaries were normal in size and signal intensity with no evidence of torsion. |
| Placental abruption / Obstetric cause | **EXCLUDED** (gray badge) | MRI showed a single live intrauterine pregnancy with a normal anterior placenta and no imaging features of placental pathology. |
| Hyperemesis gravidarum | **EXCLUDED** (gray badge) | Pain dominant over vomiting; onset after 16 weeks; bilious (not bilious-free) emesis; obstruction pattern confirmed on imaging. |

Badge styles:
- CONFIRMED → teal background, teal-dark text
- CO-EXISTING → purple-light background, purple-dark text
- EXCLUDED → surface-2 background, muted text

---

## ❌ SECTIONS 05, 06, 07 — DO NOT BUILD

These sections are explicitly removed:
- ~~Section 05: Anatomy Module~~ — SKIP
- ~~Section 06: Pathophysiology Explorer~~ — SKIP
- ~~Section 07: Imaging Gallery~~ — SKIP

> **NOTE on Images:** Placeholder image slots should be left in Section 08 (surgical step images) if needed, clearly marked as `[IMAGE PLACEHOLDER — to be added]`. Do NOT generate or use any anatomical illustrations — the client will add medically verified images later.

---

## SECTION 08 — SURGICAL MANAGEMENT

**Eyebrow:** "Section 08 · Surgical Management"
**Heading:** "A combined general surgery & obstetric management approach."

### Layout: Vertical numbered step cards

Each step card: circle number (navy) + title (500 weight) + description text

**Step 1 — Initial Stabilisation**
Maternal resuscitation with intravenous fluids, electrolyte correction, analgesia, antiemetics, and fetal well-being assessment. Nasogastric tube placed for decompression.

**Step 2 — Diagnostic Evaluation**
Abdominal ultrasound followed by MRI confirming **midgut malrotation with midgut volvulus**, prompting emergency surgical intervention.

**Step 3 — Emergency Laparoscopic Exploration**
Intraoperative confirmation of midgut volvulus with assessment of bowel viability and exclusion of bowel ischaemia. 180° clockwise volvulus noted; bowel viable post-detorsion.

**Step 4 — Definitive Surgical Management — Laparoscopic Ladd's Procedure**
Comprising: detorsion of the volvulus (counterclockwise rotation), division of Ladd's bands (release of duodenal obstruction), widening of the mesenteric base, bowel repositioning (small bowel right, colon left), and incidental appendicectomy.

**Step 5 — Postoperative Obstetric Care**
Continuous maternal monitoring, serial fetal heart rate assessment, gradual enteral nutrition, tocolysis initiated, and routine antenatal surveillance.

**Step 6 — Cervical Insufficiency Management — Emergency McDonald Cerclage**
Detection of absent cervical length with internal os funnelling on follow-up scan at postoperative day 12, followed by **emergency McDonald purse-string cervical cerclage** at the cervicovaginal junction, continuation of high-risk antenatal care and progesterone support.

> Leave an `[IMAGE PLACEHOLDER]` slot after Step 4 for an intraoperative photo (to be added later).

---

## ❌ SECTIONS 11, 12 — DO NOT BUILD

- ~~Section 11: Learning Points~~ — SKIP
- ~~Section 12: Literature Review~~ — SKIP

---

## SECTION 09 — HISTOPATHOLOGY

**Eyebrow:** "Section 09 · Histopathology"
**Heading:** "Confirming concurrent acute appendicitis."

### Layout: Single card

**Top — Visual Microscopy Simulation:**
- A canvas or SVG rendering of an H&E stained slide aesthetic (pink background, scattered purple/dark cells of varying sizes, two wavy pink lines representing mucosal layers)
- Label overlay: "H&E · 100× · Appendix · Acute suppurative appendicitis"
- This is a schematic simulation — NOT a real pathology image

**Bottom — Histopathology Data Rows:**

| Key | Value |
|-----|-------|
| Specimen | Appendix (incidental appendicectomy during Ladd's procedure) |
| Staining | H&E (Haematoxylin and Eosin) |
| Microscopy | Mucosal ulceration with dense transmural neutrophilic infiltration and acute inflammatory changes throughout all layers of the appendiceal wall |
| Impression | **Features consistent with acute suppurative appendicitis, confirming concurrent appendiceal inflammation** (red, bold) |

---

## SECTION 10 — OUTCOME

**Eyebrow:** "Section 10 · Outcome"
**Heading:** "From operating room to antenatal surveillance."

### Layout: Vertical timeline with icons + 2-column result cards at bottom

**Timeline Events:**

1. **POD 0 · Surgery** (navy)
   Emergency laparoscopic Ladd's procedure with detorsion and appendicectomy
   - Intraoperative finding: midgut malrotation with volvulus
   - Bowel viability satisfactory post-detorsion
   - Fetal heart rate monitored throughout — reassuring

2. **POD 1–3 · Recovery** (teal)
   Uneventful postoperative recovery
   - Gradual return of bowel function
   - Oral feeds resumed as tolerated from POD 2
   - Maternal and fetal status remained stable

3. **Postoperative Day 12 · Cervical Assessment** (amber)
   Cervical insufficiency diagnosed on follow-up scan
   - Absent cervical length with internal os funnelling
   - No uterine contractions or bleeding

4. **Postoperative Day 12 · Obstetric Intervention** (amber)
   Emergency McDonald cervical cerclage performed
   - Indication: cervical insufficiency with absent cervical length and funnelling
   - Procedure uneventful
   - Tocolysis and progesterone support initiated

5. **Discharge · After Recovery and Cerclage** (teal)
   Discharged in stable maternal condition with viable intrauterine pregnancy
   - Tolerating oral diet, pain controlled
   - No obstetric or surgical complications
   - Activity modification and regular follow-up advised

6. **Follow-up · Antenatal Surveillance** (teal)
   Regular antenatal follow-up
   - Serial cervical length monitoring every 2 weeks
   - Fetal growth and well-being assessment
   - Continued progesterone and necessary supplements

**Result Cards (2-column at bottom):**
- 💙 **Maternal Outcome** (teal left border): "Uneventful postoperative recovery with preserved maternal health. Stable at 6-week review."
- 👶 **Fetal Outcome** (purple left border): "Pregnancy continued; live birth at 37 weeks by elective LSCS with healthy neonate."

---

## SECTION 13 — QUIZ MODULE

**Eyebrow:** "Section 13 · Quiz Module"
**Heading:** "Test your clinical reasoning — ten case-based questions."

### Functional quiz with full state management:

**Quiz UI elements:**
- Header bar (navy): "Question X of 10" left | "Score: X" right
- Progress bar (teal fill, animated)
- Question text (Instrument Serif, 22px)
- 4 answer option cards (border, hover teal, correct = teal fill, incorrect = red fill)
- Explanation box appears after answer (surface bg, 13px, shows correct reasoning)
- "Next →" button (navy, appears after answering)
- Final result screen shows score/10 with grade label + Retry button

**All 10 Questions:**

**Q1:** What is the most pathognomonic radiological sign of midgut volvulus on ultrasound?
- A) Coffee bean sign
- B) **Whirlpool sign** ✓
- C) Bird's beak sign
- D) Target sign
- *Explanation: The whirlpool sign on Doppler ultrasound — mesenteric vessels swirling around the SMA axis — is the most specific sign for midgut volvulus. Coffee bean and bird's beak signs are associated with sigmoid volvulus.*

**Q2:** A pregnant woman at 20 weeks presents with bilious vomiting and periumbilical pain. First imaging modality of choice?
- A) CT abdomen with contrast
- B) Plain X-ray abdomen
- C) **Abdominal ultrasound** ✓
- D) Upper GI endoscopy
- *Explanation: Ultrasound is first-line in pregnancy — safe, readily available, assesses bowel and fetal wellbeing simultaneously. MRI is the second step for confirmation.*

**Q3:** In a Ladd's procedure, what is the correct bowel repositioning after detorsion?
- A) Small bowel left, colon right
- B) **Small bowel right, colon left** ✓
- C) Small bowel centre, colon periphery
- D) No repositioning needed
- *Explanation: After detorsion and division of Ladd's bands, small bowel goes right and colon goes left — the 'non-rotation' position — widening the mesenteric base and reducing recurrence risk.*

**Q4:** Why is incidental appendicectomy performed during Ladd's procedure for malrotation?
- A) To prevent future torsion
- B) **Because the appendix lies ectopically in malrotation, making future appendicitis diagnosis unreliable** ✓
- C) Appendicitis always co-exists
- D) Mandatory surgical protocol
- *Explanation: In malrotation, the appendix lies in an ectopic position (often left-sided or central). Future appendicitis would not present with classic right iliac fossa pain — prophylactic appendicectomy prevents this diagnostic dilemma.*

**Q5:** What Hb value constitutes 'moderate anaemia' in pregnancy per WHO?
- A) < 11.0 g/dL
- B) < 9.0 g/dL
- C) **7.0–9.9 g/dL** ✓
- D) < 7.0 g/dL
- *Explanation: WHO defines anaemia in pregnancy as Hb < 11 g/dL. Moderate anaemia = 7.0–9.9 g/dL. This patient's Hb of 8.8 g/dL falls in the moderate range.*

**Q6:** McDonald cerclage differs from Shirodkar cerclage primarily in that it:
- A) Uses a permanent non-absorbable suture
- B) **Is a purse-string suture at the cervicovaginal junction without tissue dissection** ✓
- C) Requires general anaesthesia
- D) Is placed transabdominally
- *Explanation: McDonald cerclage is a simple purse-string at the cervicovaginal junction without extensive tissue dissection — faster and preferred in emergency settings. Shirodkar involves dissection and is placed higher at the internal os.*

**Q7:** Cervical insufficiency at 22 weeks is best diagnosed by:
- A) Digital cervical examination
- B) Transabdominal ultrasound
- C) **Transvaginal ultrasound showing cervical length < 25mm with funnelling** ✓
- D) MRI pelvis
- *Explanation: Transvaginal ultrasound (TVS) is the gold standard. Cervical length < 25mm at ≤24 weeks with funnelling (internal os opening) confirms cervical insufficiency, as seen in this case.*

**Q8:** The 'whirlpool sign' in midgut volvulus represents:
- A) Air-fluid levels in dilated bowel
- B) **Clockwise rotation of the SMV and mesentery around the SMA** ✓
- C) Peritoneal free fluid
- D) Bowel wall thickening
- *Explanation: The whirlpool sign = SMV and mesentery rotating around the SMA. Normally the SMV lies to the right of the SMA; in malrotation with volvulus, it rotates around it.*

**Q9:** Primary risk of delayed diagnosis of midgut volvulus in pregnancy?
- A) Preterm labour only
- B) **Bowel ischaemia and necrosis leading to maternal and fetal death** ✓
- C) Cervical incompetence
- D) Placental abruption
- *Explanation: Bowel ischaemia and necrosis is the primary risk — twisted mesentery compresses mesenteric vessels, causing rapid bowel infarction. Maternal mortality from intestinal necrosis approaches 20–35%.*

**Q10:** Which statement about intestinal malrotation in adults is TRUE?
- A) It always presents in childhood
- B) It is always symptomatic
- C) **It may be asymptomatic for decades before presenting with volvulus in adulthood** ✓
- D) Laparoscopic approach is contraindicated in pregnancy
- *Explanation: Malrotation can remain completely asymptomatic until adulthood, when physiological stress (such as pregnancy) alters bowel mechanics and precipitates volvulus. Laparoscopic Ladd's is safe in pregnancy with appropriate positioning.*

**Grade Scale:**
- 9–10/10 → "Expert — Outstanding clinical reasoning!"
- 7–8/10 → "Advanced — Well done!"
- 5–6/10 → "Intermediate — Good effort."
- 0–4/10 → "Keep studying — review the case sections above."

---

## SECTION 14 — AI TUTOR

**Eyebrow:** "Section 14 · AI Tutor"
**Heading:** "Ask anything about this case."

### Functional AI chat interface powered by Claude API

**UI Components:**
- Header bar: animated green pulse dot + "Clinical AI Tutor" + "Powered by Claude" (right, muted)
- Chat messages area (min-height 280px, scrollable, max-height 400px)
- Opening AI message: "Hello! I'm your AI tutor for this case. I can help you understand midgut volvulus in pregnancy, the significance of the Ladd's procedure, cervical incompetence management, or any clinical reasoning questions about this case. What would you like to explore?"
- Quick question pill buttons (teal outline, hover fills teal):
  - "Bilious vomiting significance"
  - "Ladd's procedure"
  - "Whirlpool sign"
  - "Cerclage choice"
- Input field + Send button (navy)
- Typing animation (3 bouncing dots) while API call in progress

**API Implementation:**
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: `You are a clinical AI tutor for a medical case report titled "Between Obstruction and Loss: A rare case of midgut volvulus with cervical incompetence at 20 weeks gestation." 
    Case summary: 23-year-old primigravida at 20+1 weeks presented with acute abdominal pain, bilious vomiting, and bleeding per vaginum. Diagnosed with midgut volvulus secondary to intestinal malrotation (MRI whirlpool sign). Emergency laparoscopic Ladd's procedure performed. Incidental acute appendicitis found on histopathology. Postoperative cervical insufficiency managed with McDonald cerclage. Live birth at 37 weeks.
    Answer questions about this case, its pathophysiology, surgical management, and clinical reasoning. Be educational, accurate, and concise (under 120 words per response).`,
    messages: [{ role: "user", content: userMessage }]
  })
});
```

---

## SECTION 15 — LEADERBOARD

**Eyebrow:** "Section 15 · Leaderboard"
**Heading:** "Top performers on this case."

### Static leaderboard with dynamic user entry

**Table columns:** Rank | Clinician (with 2-letter avatar circle) | Score | Level badge

**Pre-populated entries:**

| Rank | Name | Score | Level |
|------|------|-------|-------|
| 🥇 | Dr. R. Kumar | 10/10 | Expert (teal badge) |
| 🥈 | Dr. S. Patel | 9/10 | Expert (teal badge) |
| 🥉 | Dr. A. Nair | 9/10 | Advanced (purple badge) |
| 4 | Dr. M. Verma | 8/10 | Advanced (purple badge) |
| 5 | Dr. T. Rao | 8/10 | Intermediate (amber badge) |

**After quiz completion:** User's own row appears (highlighted, teal left border) with their quiz score and calculated rank.

**Name entry form at bottom:**
- Text input: "Enter your name..."
- Submit button (navy)
- Confirmation alert on submit

**Level badges:**
- Expert (9–10): teal-light bg, teal-dark text
- Advanced (7–8): purple-light bg, purple-dark text
- Intermediate (5–6): amber-light bg, amber text

---

## FOOTER

- Left: "Between Obstruction and Loss" (500 weight) + "An interactive case report · For educational use only · © 2026" (muted, 11px)
- Right: `Cite as: Mehta A, Iyer R, Khan S. 2026.` in JetBrains Mono, 11px
- Separated from content by 0.5px border-top
- Max-width 900px, same as content

---

## IMAGE PLACEHOLDER STRATEGY

> The client will add real medical images later. Build the following placeholder slots — clearly marked with a dashed border and label:

1. **Section 08, after Step 4:** `[IMAGE PLACEHOLDER — Intraoperative photo: 180° clockwise volvulus, viable bowel post-detorsion]`
2. **Section 09, top of histopathology card:** Either a programmatic H&E simulation (canvas with pink bg + purple cell dots + wavy mucosal lines) OR a placeholder slot labeled `[IMAGE PLACEHOLDER — H&E slide: Appendix, Acute Suppurative Appendicitis, 100×]`

---

## INTERACTIVITY CHECKLIST

| Feature | Requirement |
|---------|-------------|
| Sticky nav | Scroll to sections on click |
| Hero CTAs | "Begin the case" scrolls to Section 01; "Take the quiz" scrolls to Section 13 |
| Case timeline | Horizontally scrollable, color-coded dots |
| Diagnostic journey | 6-tab switcher, only active panel visible |
| Quiz | Full state machine: render Q → select answer → show explanation → next → result screen → retry |
| Quiz scoring | Score tracked, feeds into leaderboard row after completion |
| AI Tutor | Real API call to Claude, typing animation, quick-question shortcuts, keyboard Enter to send |
| Leaderboard | Static entries + dynamic user row after quiz; name entry form |
| Scroll reveal | All sections fade+slide in on scroll entry |
| Mobile responsive | All grids collapse to single column at ≤600px |

---

## SECTIONS TO SKIP — DO NOT BUILD

| Section | Reason |
|---------|--------|
| Authors block | Explicitly removed per instructions |
| Hero image / anatomical illustration | Marked as medically incorrect, to be replaced later |
| Section 05 — Anatomy Module | Crossed out in instructions |
| Section 06 — Pathophysiology Explorer | Crossed out in instructions |
| Section 07 — Imaging Gallery | Crossed out in instructions |
| Section 11 — Learning Points | Crossed out in instructions |
| Section 12 — Literature Review | Crossed out in instructions |

---

## OUTPUT FORMAT

- Next js latest
- All CSS in a `<style>` block in `<head>`
- All JS in a `<script>` block before `</body>`
- Google Fonts loaded via `<link>` in `<head>`
- No external CSS frameworks (no Tailwind, no Bootstrap)
- No external JS libraries required (vanilla JS only)
- The Anthropic API call does not require an API key in the frontend — the platform handles auth injection automatically
