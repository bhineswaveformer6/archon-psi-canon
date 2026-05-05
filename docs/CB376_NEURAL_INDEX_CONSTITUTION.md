# CB-376 · Neural Index Constitution v1.0
**Sealed:** May 2026 | **Author:** Brandon Hines [Ψ-001] | **Status:** CANON_SEALED

## The Stack
Signal (y_i,t,k) → Latent State (z_i,t) → Traits (θ_i) → G-Index → Genius Index → VOLTS

## Core Equations

### State-Space (Brain as Dynamical System)
```
z_{t+1} = Az_t + Bu_t + η_t
y_t = Cz_t + η_t
```

### G-Index (General Intelligence)
```
θ_i = Wf_i + ε_i
f_i = [Stability, WM-Control, LearningRate, Flexibility, MetaAwareness]^T
```

### Genius Index
```
Genius_i = N_i × U_i × S_i × P_i
```
- N = Novelty (embedding-space distance from prior work)
- U = Utility (downstream performance lift)
- S = Surprise (improbability under baseline)
- P = Persistence (sustained execution under uncertainty)

### Expected Value of Control (EVC / Will Value)
```
EVC_{i,t} = E[Benefit | control] - Cost(control)
```

### VOLTS Minting
```
VOLTSMint_i = κ × max(0, ΔOutcome_i) × 𝟙[Verified]
```

## Deployment Architecture
- **Primary market:** Enterprise productivity first → clinical → trading
- **Genius Index:** Capacity (neural signatures) + Outputs (validation layer)
- **Data layer:** Wearable biosignals + EEG, on-device extraction

## Three Answers That Shape Everything
1. Enterprise first — Fortune 500 productivity lift, legible procurement path
2. Capacity now, outputs as validation
3. Wearable biosignals + EEG, GDPR/LGPD compliant

## Thesis
Neural Capitalism is a measurement civilization. ARCHON Ψ is the canonical implementation of the chain: Signal → State → Trait → Index → Value → VOLT. CB-377 is the product spec that goes to engineers.
