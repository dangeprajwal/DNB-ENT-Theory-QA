---
tags:
  - paper2
  - rhinology
  - surgery
  - fess
---

# Image-guided Navigation in FESS, Balloon Sinuplasty and CT Evaluation

**Questions:**

- *Q28 (Jun 2020): Discuss the role of preoperative CT in FESS. Describe the navigation system in FESS.*
- *Q95 (Oct 2023): Discuss the role of navigation and balloon sinuplasty in CRS.*
- *Q109 (May 2024): Describe the principles, types and indications of navigation surgery in FESS and skull base.*
- *2015-19: Discuss the indications of stereotactic navigation in FESS. Enumerate MIER surgical strategies.*

**Source:** Scott-Brown's Otorhinolaryngology, 8th Edition — Volume 1, Chapter 48 (Image-Guided Surgery, 3D Planning and Reconstruction), Chapter 98 (FESS Outcomes), Chapter 99 (The [[Frontal Recess Frontal Sinus Surgery|Frontal Sinus]])

---

## INTRODUCTION

Computer-aided surgery has become an integral part of modern endoscopic sinus and skull base surgery. Image-guided surgery (IGS) enables the surgeon to navigate instruments within the operative field while viewing their position on a computer screen in relation to preoperative CT or MRI data. Balloon sinuplasty, introduced in 2006, represents a minimally invasive alternative to conventional FESS for selected patients. Both technologies supplement, but do not replace, a thorough understanding of sinonasal anatomy and meticulous surgical technique.

---

## PART A: ROLE OF PREOPERATIVE CT IN FESS

A CT scan with bone windows is essential before FESS. The surgeon must reconstruct a 3D model from 2D slices using learned anatomical knowledge. The CT serves three purposes: disease assessment, anatomical assessment and navigation dataset.

### Disease Assessment

- Extent of mucosal disease (polyps, oedema, secretions)
- Lund-Mackay scoring: each sinus graded 0 (clear), 1 (partial opacification), 2 (total opacification); OMC scored 0 or 2; maximum score = 24

### Critical Anatomical Variants to Identify

| Variant | Significance |
|---------|-------------|
| Keros type (I–III) | Olfactory fossa depth → [[CSF Rhinorrhea|CSF leak]] risk |
| Lamina papyracea dehiscence | Orbital injury risk |
| AEA position (24-12-6 rule) | Skull base vessel landmark |
| Onodi cell | Posterior ethmoid cell related to optic nerve |
| Haller cell | Infraorbital ethmoid → maxillary ostium obstruction |
| Sphenoid pneumatization | ICA/optic nerve relationship |
| Intersinus septum attachment | May attach to ICA in sphenoid |
| Uncinate attachments | Determines frontal drainage pathway |

The CT data also serves as the imaging dataset for IGS navigation systems.

---

## PART B: IMAGE-GUIDED SURGERY — PRINCIPLES

### Overview

IGS uses preoperative imaging data (CT/MRI) registered to the patient's real-world coordinates so that the surgeon can navigate instruments and see their position on a screen relative to patient anatomy.

### Components of an IGS System

1. **Imaging data**: CT (bone detail) or MRI (soft tissue) creating a 3D volume
2. **Image processing**: 3D reconstruction, segmentation, enhancement
3. **Registration**: correlation of virtual data to real patient anatomy
4. **Tracking**: continuous positional sensing of instruments
5. **Display**: orthogonal 2D slices, 3D volume or augmented reality overlay

### Registration Methods

Registration correlates the virtual dataset with the physical patient. Key methods include:

| Method | Accuracy | Technique |
|--------|----------|-----------|
| Anatomical landmarks | 3–4 mm | Point to tragus, outer canthus, nasion |
| Surface point sampling | 2–3 mm | 40–100 random points around operative region |
| Laser surface scanning | 2–3 mm | Speeds up surface point acquisition |
| Fiducial markers | <2 mm | Applied to skin before scanning; most accurate |

**Important distinction**: Registration error measures accuracy between selected virtual points and corresponding patient landmarks. It is **not synonymous with target error** — the target error is the error expected when a probe is placed on a random point within the surgical field. Target error is influenced by registration error and is worse for targets outside the volume described by the fiducial markers.

---

## PART C: TRACKING DEVICES

Tracking devices provide dynamic positional information in real time. Requirements include: very precise, consistently accurate, >25 readings per second, insensitive to temperature changes and metal objects, and able to track at least two objects simultaneously.

| Tracking Type | Mechanism | Key Feature |
|--------------|-----------|-------------|
| Electromagnetic | Magnetic field distribution | **No line-of-sight issues — ideal for ENT**; flexible probes possible; accuracy affected by metal |
| Infrared optical (active) | LEDs on patient/probe | Most commonly used; 2–5 mm accuracy; needs clear line-of-sight |
| Infrared optical (passive) | IR reflected from metallic balls | Reliable; IR source on sensing device; line-of-sight required |
| Mechanical arm | Potentiometers at joints | Fast and accurate but cumbersome and restricted range |

Electromagnetic tracking is particularly useful for frontal sinus surgery as the flexible probes can navigate curved pathways without line-of-sight restrictions. Infrared optical systems are the most widely employed in current surgical practice.

---

## PART D: CLINICAL APPLICATIONS AND INDICATIONS FOR IGS

### Indications in FESS and Skull Base Surgery

- **Revision FESS** with absent or distorted anatomical landmarks
- **Frontal recess surgery** (Draf type 2 and 3 procedures) — localizing the frontal recess floor
- **Transphenoidal/trans-nasal endoscopic pituitary surgery** (replaces conventional X-ray image intensifiers)
- Disease in proximity to the skull base, orbit, optic nerve or ICA
- Severe polyposis with distorted anatomy
- Skull base tumour surgery (extended endoscopic endonasal approaches)
- Petrous apex lesions (identifying facial nerve, IAM structures)
- Congenital abnormalities with unusual anatomy

### MIST/MIER Surgical Strategies

Minimally Invasive Sinus Technique (MIST) or Minimally Invasive Endoscopic Rhinosurgery (MIER) emphasizes minimal tissue removal. The philosophy is that following an uncinectomy, transitional spaces are opened with minimal mucosal disruption.

This contrasts with "full-house" FESS where all sinuses are systematically opened. A study demonstrated that full-house FESS with postoperative steroid irrigations significantly reduces recurrence in CRSwNP. The debate between aggressive versus conservative FESS approaches remains unresolved, with future research needed to determine the optimal extent of surgery.

### Surgical Planning and Simulation

3D volume data enables objective surgical planning, communication between surgeons, and review of anatomy. Surgical simulators with haptic feedback allow trainees to practise endoscopic sinus procedures on virtual models, developing hand-eye coordination before operating on real patients.

---

## PART E: BALLOON SINUPLASTY

### Technique

Introduced in 2006, balloon sinuplasty introduces a balloon over a guidewire (which may be illuminated to confirm its position in the frontal sinus). Once spanning the sinus ostium, the balloon is dilated with a controlled inflation device to gently enlarge the ostium by microfracturing surrounding bone while preserving mucosa.

### Applications

Can be applied to maxillary, frontal and sphenoid sinus ostia. Often combined with conventional ESS as a **"hybrid procedure"**.

### Evidence

- Ostial patency rates: **80.5% at 6 months, 85.1% at 1 year, 91.6% at 2 years**
- Small RCTs show **non-inferiority to FESS**
- Non-randomized trial showed lower SNOT-20 scores at 3 months versus conventional FESS
- **Cadaveric concern**: when the maxillary "ostium" is balloon-dilated, the true ostium may be missed and a false ostium created in the posterior fontanelle (confirmed by an Austrian clinical study)
- Significant healthcare costs with disposable balloons (reusable systems now entering market)

### Role in Frontal Sinus (Graduated Approach)

| Step | Approach | Indication |
|------|----------|------------|
| 1 | No exploration | No disease in frontal recess |
| 2 | Balloon sinuplasty | Limited disease; certain situations |
| 3 | Draf type I | Chronic frontal sinusitis; ethmoidectomy + recess clearance |
| 4 | Draf type IIa/b | Failed conservative approach; cells extending into frontal sinus |
| 5 | Draf type III | Failed Draf II; bilateral frontal sinusitis |
| 6 | Osteoplastic flap | Failed endoscopic approaches |

The general principle is to choose the **least invasive approach** to achieve the desired outcome.

### FESS Revision Rates

- Overall: **10–20% over 5 years**
- CRSwNP: 21% revision rate
- CRSsNP: 15% revision rate
- Eosinophilic CRS has higher recurrence rates

---

> [!abstract] Key Points for Examination
> 1. Preoperative CT with bone windows is essential before FESS — it identifies critical anatomical variants (Keros type, Onodi cells, Haller cells, ICA dehiscence) and provides the dataset for IGS navigation
> 2. Lund-Mackay CT scoring grades each sinus 0–2 with a maximum score of 24 — OMC is scored as either 0 or 2
> 3. IGS registration using anatomical landmarks achieves 3–4 mm accuracy; surface point sampling improves this to 2–3 mm; fiducial markers placed before scanning are most accurate
> 4. Electromagnetic tracking has no line-of-sight issues and is ideal for ENT — infrared optical tracking is the most commonly used system achieving 2–5 mm accuracy in theatre
> 5. IGS is most useful in revision FESS with distorted landmarks, frontal recess surgery (Draf 2/3) and transphenoidal pituitary surgery
> 6. Registration error is NOT the same as target error — target error may be significantly worse for targets outside the fiducial marker volume
> 7. Balloon sinuplasty was introduced in 2006 as a minimally invasive alternative — ostial patency rates are 80–92% at 6 months to 2 years
> 8. Cadaveric studies show balloon dilation of the maxillary sinus may create a false ostium in the posterior fontanelle rather than dilating the true ostium
> 9. FESS revision rates are 10–20% over 5 years — higher for CRSwNP (21%) than CRSsNP (15%)
> 10. The graduated approach to frontal sinus surgery ranges from no exploration through balloon to Draf I → IIa/IIb → III → osteoplastic flap — the least invasive effective approach should be chosen


---

> [!tip] Clinical Pearls
> - IGS does NOT replace surgical knowledge of anatomy — it is an adjunct tool and the surgeon must always correlate navigational position with direct visual assessment
> - Electromagnetic tracking devices are particularly valuable for frontal sinus surgery because flexible probes can navigate curved pathways without line-of-sight limitations
> - The intersinus septum in the sphenoid may attach directly to the ICA — dissecting across it can injure the contralateral ICA, making preoperative CT review critical
> - Balloon sinuplasty combined with FESS (hybrid procedure) is increasingly popular — evidence for balloon alone as first-line treatment remains limited
> - MIST/MIER philosophy emphasizes minimal tissue removal following uncinectomy — full-house FESS with postoperative steroid irrigations has shown superior outcomes in CRSwNP


---

*END OF ANSWER*
