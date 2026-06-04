---
tags:
  - paper1
  - otology
  - facial-nerve
  - flowchart
---

# Facial Nerve Injury — Management Flowchart

**Source:** Scott-Brown's Otorhinolaryngology, 8th Edition — Volume 2, Chapter 112 (The Facial Nerve and Its Non-Neoplastic Disorders), Chapter 91 (Ear Trauma)

---

```mermaid
flowchart TD

    START([🧠 FACIAL PALSY — CN VII\nPresentation to ENT])

    %% ══════════════════════════════════════════════
    %% SECTION 1 — INITIAL ASSESSMENT
    %% ══════════════════════════════════════════════
    START --> ONSET{Onset of Palsy?}

    ONSET -->|Immediate onset| COMP{Completeness?}
    ONSET -->|Delayed onset — more than 1 hour after injury| DELAY["⬆ DELAYED ONSET\nMechanism: neural oedema / haematoma\nNeural continuity preserved\nPrognosis: EXCELLENT"]

    DELAY --> CONS

    COMP -->|Incomplete — HB Grade II–V| CONS
    COMP -->|Complete — HB Grade VI| INVPATH

    %% ══════════════════════════════════════════════
    %% SECTION 2 — GRADING
    %% ══════════════════════════════════════════════
    START --> HBGRADE["House-Brackmann Grading\nI = Normal\nII = Mild — slight asymmetry\nIII = Moderate — obvious weakness\nIV = Moderately severe — disfiguring\nV = Severe — barely perceptible\nVI = Total paralysis — no movement"]

    %% ══════════════════════════════════════════════
    %% SECTION 3 — CONSERVATIVE MANAGEMENT
    %% ══════════════════════════════════════════════
    CONS["✅ CONSERVATIVE MANAGEMENT"] --> ST["Steroids\nPrednisolone 1 mg/kg/day\n1–3 weeks with taper"]
    CONS --> EC["Eye Care\nLubricants / moisture chamber\nTape eyelid at night"]
    CONS --> OBSV["Serial Clinical Observation\nMonitor for progression"]

    %% ══════════════════════════════════════════════
    %% SECTION 4 — INVESTIGATIONS for Complete Palsy
    %% ══════════════════════════════════════════════
    INVPATH["⚠ IMMEDIATE COMPLETE PALSY\nFull investigation required"] --> HRCT["HRCT Temporal Bone\nFracture line\nFallopian canal involvement\nSite of nerve injury"]
    INVPATH --> TOPODT["Topodiagnostic Tests\nLocalise anatomical level of lesion"]
    INVPATH --> ENOG["ENoG — Electroneuronography\nUseful: Day 3 to Day 14 only\nSupramaximal CMAP vs normal side"]

    %% ── Topodiagnostic branch
    TOPODT --> TP1["Schirmer's Test\nGreater petrosal nerve\nGeniculate ganglion level\nAbnormal = >75% reduction in lacrimation"]
    TOPODT --> TP2["Stapedial Reflex\nNerve to stapedius\nImpedance audiometry\nAbsent = lesion at / above stapedius"]
    TOPODT --> TP3["Taste / Salivary Flow\nChorda tympani\nElectrogustometry + Wharton's cannulation\nAbnormal = lesion above chorda"]

    TP1 --> LOCLGC["Lesion at Geniculate Ganglion\nAbnormal: Schirmer + Stapedial + Taste"]
    TP2 --> LOCSTAP["Lesion between Geniculate and Stapedius\nNormal lacrimation + Absent stapedial + Abnormal taste"]
    TP3 --> LOCCHOR["Lesion between Stapedius and Chorda\nNormal lacrimation + Normal stapedial + Abnormal taste"]

    %% ── ENoG branch
    ENOG --> ENRES{ENoG Result?}
    ENRES -->|"< 90% degeneration"| CONS
    ENRES -->|"> 90% degeneration within 6 days"| SXIND["🔴 SURGICAL EXPLORATION\nIndicated — discuss risks / benefits"]
    ENRES -->|"No response — or presentation > 3 weeks"| EMGTEST

    EMGTEST["EMG — Electromyography\nRecords motor unit potentials\nOrbicularis oculi and oris"] --> EMRES{EMG Finding?}
    EMRES -->|"Polyphasic potentials"| POLYPH["Regeneration Occurring\nSurgery NOT indicated\nClose follow-up only"]
    EMRES -->|"Fibrillation potentials"| SXIND
    EMRES -->|"Electrical silence"| REAN["Facial Reanimation\nMotor end plates lost\nStatic or dynamic procedure"]

    %% ══════════════════════════════════════════════
    %% SECTION 5 — AETIOLOGY-SPECIFIC BRANCHES
    %% ══════════════════════════════════════════════
    START --> AET{Aetiology?}

    AET -->|Temporal bone fracture| TBF
    AET -->|CSOM — Cholesteatoma| CSOMN
    AET -->|Acute Otitis Media| AOMN
    AET -->|Iatrogenic — post mastoid surgery| POSTOP

    %% ── TRAUMATIC BRANCH
    TBF["🟡 TRAUMATIC PALSY\nTemporal Bone Fracture\nFN palsy in 7% of TB fractures\n66% at geniculate ganglion"] --> TTYPE{Fracture type and hearing status?}

    TTYPE -->|"Longitudinal — hearing preserved"| MFA["Middle Fossa Approach\nAccess geniculate and labyrinthine segment"]
    TTYPE -->|"Transverse — hearing preserved"| MFTM["Middle Fossa + Transmastoid\nBilateral decompression"]
    TTYPE -->|"Any type — profound SNHL"| TLA["Translabyrinthine Approach\nEasier access — sacrifices hearing"]

    MFA --> SXIND
    MFTM --> SXIND
    TLA --> SXIND

    %% ── CSOM BRANCH
    CSOMN["🟡 CSOM-RELATED PALSY\nCholesteatoma erosion\nFallopian canal osteitis"] --> CSO1["CT Scan\nDelineate site of Fallopian canal erosion"]
    CSO1 --> CSO2["Mastoidectomy + Facial Nerve Decompression\nRemove cholesteatoma / granulation tissue\nAssess nerve integrity"]

    CSO2 -->|Nerve intact but compressed| DECO["Decompression Only\nEpineurium slitting if needed"]
    CSO2 -->|">50% circumference disrupted"| REPAR["Repair\nDirect suture or inlay graft"]
    CSO2 -->|Transected| GRAFTN["End-to-end Anastomosis\nor Interposition Nerve Graft"]

    %% ── AOM BRANCH
    AOMN["🟡 AOM-RELATED PALSY\nInflammatory oedema / toxins\nFallopian canal dehiscence"] --> AOMTX["IV Antibiotics + Steroids\nMedical management first"]
    AOMTX --> MYRING["Myringotomy + Ventilation Tube\nif no spontaneous perforation\nCortical mastoidectomy if not improving"]
    MYRING --> AOMOUT["Generally Good Prognosis\nSurgical decompression rarely needed"]

    %% ── POST-MASTOID BRANCH
    POSTOP["🟡 POST-OPERATIVE PALSY\nIncidence 0.6–3.6%\nMost common site: distal tympanic + second genu"] --> PMTYPE{Type of palsy?}

    PMTYPE -->|"Possibly local anaesthetic effect"| OBSWAIT["Observe 2–4 hours\nRemove tight dressing over nerve"]
    PMTYPE -->|Incomplete palsy| STEROPO["Oral Steroids\nSerial observation"]
    PMTYPE -->|Complete — immediate| REEXPL["HRCT + Plan Re-exploration\nTransfer to regional centre\nImmediate re-exploration not advocated — plan carefully"]
    PMTYPE -->|"Delayed post-op — days later"| VIRAL["Steroids + Acyclovir\nPresume HSV/VZV reactivation\nGenerally good prognosis"]

    OBSWAIT --> STEROPO
    STEROPO -->|Progresses to complete palsy| REEXPL

    %% ══════════════════════════════════════════════
    %% SECTION 6 — SURGICAL TECHNIQUE
    %% ══════════════════════════════════════════════
    SXIND --> SXFIND{Intra-operative Finding?}

    SXFIND -->|"Compressed / oedematous — in continuity"| SDEC["Decompression of Fallopian Canal\nOpen canal — slit epineurium if needed"]
    SXFIND -->|"Crushed — in continuity"| SANA["Primary End-to-End Anastomosis\nTension-free — 9/0 nylon"]
    SXFIND -->|Transected — gap present| SGRAFT["Interposition Nerve Graft\nGreat auricular nerve or Sural nerve\nAxonal regrowth: 1 mm per day"]

    %% ══════════════════════════════════════════════
    %% SECTION 7 — OUTCOMES
    %% ══════════════════════════════════════════════
    SDEC --> OUT1(["✅ Expected HB I–II\nFull or near-full recovery"])
    DECO --> OUT1
    POLYPH --> OUT1
    AOMOUT --> OUT1

    SANA --> OUT2(["⚠ Partial Recovery HB II–III\nSome synkinesis possible"])
    REPAR --> OUT2

    SGRAFT --> OUT3(["⚠ Partial Recovery HB III–IV\nAxonal regrowth: months to years"])
    GRAFTN --> OUT3

    REAN --> OUT4(["Static sling — immediate cosmesis\nDynamic reanimation — gracilis / masseter\nNerve transfer — hypoglossal XII to VII"])

    %% ══════════════════════════════════════════════
    %% STYLING
    %% ══════════════════════════════════════════════
    classDef startNode   fill:#1e40af,stroke:#1e3a8a,color:#ffffff,font-weight:bold
    classDef decision    fill:#fef3c7,stroke:#d97706,color:#1c1917,font-weight:bold
    classDef conservative fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef investigate fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    classDef aetiology   fill:#ede9fe,stroke:#7c3aed,color:#3b0764
    classDef surgical    fill:#fee2e2,stroke:#dc2626,color:#7f1d1d,font-weight:bold
    classDef outcome     fill:#ecfdf5,stroke:#059669,color:#064e3b,font-weight:bold
    classDef grading     fill:#f0f9ff,stroke:#0284c7,color:#0c4a6e

    class START startNode
    class ONSET,COMP,ENRES,EMRES,AET,TTYPE,PMTYPE,SXFIND decision
    class CONS,ST,EC,OBSV,DELAY,POLYPH,AOMOUT,VIRAL,OBSWAIT conservative
    class INVPATH,HRCT,TOPODT,TP1,TP2,TP3,LOCLGC,LOCSTAP,LOCCHOR,ENOG,EMGTEST investigate
    class TBF,CSOMN,AOMN,POSTOP,MFA,MFTM,TLA,CSO1,CSO2,AOMTX,MYRING,STEROPO,REEXPL aetiology
    class SXIND,SXFIND,SDEC,SANA,SGRAFT,DECO,REPAR,GRAFTN surgical
    class OUT1,OUT2,OUT3,OUT4,REAN outcome
    class HBGRADE grading
```

---

> [!abstract] Reading the Flowchart
> - **Yellow diamonds** = Decision points
> - **Blue nodes** = Investigations and localisation tests
> - **Green nodes** = Conservative management and good prognosis
> - **Red nodes** = Surgical management required
> - **Purple nodes** = Aetiology-specific pathways
> - **Teal nodes** = Expected outcomes

---

*See also: [[Facial Nerve]] — full anatomy, grading, topodiagnostic tests and management text; [[Facial Nerve Monitoring]] — intra-operative monitoring*
