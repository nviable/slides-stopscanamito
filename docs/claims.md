# Claims register

Every factual claim on a slide comes from this file. The wordings were verified on 30 Sep 2026 and agreed on 6 Oct 2026. If you change a slide's claim, change it here in the same commit and keep the source.

## Provenance, standards and policy

| Claim as worded on the slide | Slide | Source |
| --- | --- | --- |
| The Pixel Camera app is a C2PA Assurance Level 2 generator | Many hands | [Google](https://blog.google/security/pixel-android-trusted-images-c2pa-content-credentials/) |
| Apple Reference Image (iPhone 18 Pro, Sep 2026) is signed at the sensor and is separate from C2PA, though a reference image can be referenced from a C2PA manifest. No cross-platform verifier has been described | Many hands, Two families | [Apple Security Research](https://security.apple.com/blog/apple-reference-image/) |
| Apple, C2PA and JPEG Trust are complementary layers. C2PA can be carried inside JPEG Trust. None of this is integrated in practice yet | Two families | [ISO/IEC 21617-1:2026](https://www.iso.org/standard/91405.html) |
| EU AI Act Article 50 applies from 2 Aug 2026. Machine-readable marking for generative systems already on the market has until 2 Dec 2026. The Code of Practice is voluntary and names no standard | Many hands | [European Commission](https://digital-strategy.ec.europa.eu/en/factpages/quick-facts-transparency-rules-ai-systems) |
| NIST AI 100-4 is a final overview report (20 Nov 2024), not a standard | Many hands | [NIST](https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content) |
| JPEG Trust is ISO/IEC 21617-1:2026, 2nd edition (26 Aug 2026). Parts 2 to 4 are not yet published | Many hands, Four asks | [ISO](https://www.iso.org/standard/91405.html) |
| Validators that skip revocation checks by default could still show Nikon's invalidated certificates as valid | Asks opening, tech demo notes | [PetaPixel](https://petapixel.com/2025/09/22/nikon-cant-fully-solve-the-z6-iiis-c2pa-problems-alone/) |
| Nikon suspended content credentials on its only C2PA camera, the Z6III, in Sep 2025 after a signing flaw, and invalidated every certificate it had issued. It has announced no restart, while Canon and Sony expanded support in 2026 | Asks opening | [DPReview](https://www.dpreview.com/news/0156322200/nikon-temporarily-suspends-its-z6iii-content-credential-program/), [Canon](https://global.canon/en/news/2026/20260511.html) |
| A researcher forged Pixel Camera signatures on rooted or fault-injected Pixel 8a and 9a phones by using the hardware key as a signing oracle, without extracting it. Blog post, not peer-reviewed. Not a Pixel 10 result | Asks opening | [Buchanan](https://www.da.vidbuchanan.co.uk/blog/android-c2pa.html) |
| Photographing a synthetic image on a screen with a signing camera yields a valid signature | Asks opening | [Park et al., USENIX Security 2025](https://www.usenix.org/system/files/usenixsecurity25-park.pdf) |
| A validly signed manifest can omit the AI-origin assertion while the watermark says synthetic | Asks opening, Concern map | [Nemecek et al., CVPR Workshops 2026](https://arxiv.org/abs/2603.02378) |
| The IPTC Verified News Publishers List makes no judgement on editorial position | Concern map | [IPTC](https://iptc.org/news/iptc-c2pa-verified-news-publishers/) |
| The C2PA Conformance Program lists validator products. Conformance is a separate process, so the ask to this room is a pilot with members | Speaker notes, Four asks | [C2PA Conformance Program v0.2](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Conformance%20Program.md) |
| Validators accepting revoked certificates and disagreeing with each other. Preprint, held in reserve for questions | Not on a slide | [Golaszewski et al., ePrint 2026/804](https://eprint.iacr.org/2026/804) |

### What each piece does well (asks opening, beat 2)

| Statement on the slide | Piece | Source |
| --- | --- | --- |
| Ties an image to the device that captured it | Capture signing | [Google](https://blog.google/security/pixel-android-trusted-images-c2pa-content-credentials/) |
| Lets anyone check who signed a file and what changed | C2PA validator | [C2PA 2.4](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html) |
| Confirms which news organisation signed the content | IPTC publisher list | [IPTC](https://iptc.org/news/iptc-c2pa-verified-news-publishers/) |
| Can still flag AI output when metadata is stripped | Watermark check | [NIST AI 100-4](https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content) |

Wordings to avoid. "Camera makers are backing out" (only Nikon, and it is a suspension). "Pixel 10 was broken" (it was Pixel 8a and 9a, and no key was extracted). "Apple's C2PA credentials" (Reference Image is not C2PA). "IPTC or JPEG Trust certify verifiers" (neither does).

## People and media

| Claim as worded on the slide | Slide | Source |
| --- | --- | --- |
| Across 3,002 people in the US, Germany and China, most could not reliably tell AI-generated media from real, and AI media was rated more human-like | Misinformation | [Frank et al., IEEE S&P 2024](https://arxiv.org/abs/2312.05976) |
| In five experiments with over 15,000 US adults, politicians who called a scandal fake news or a deepfake gained support. The effect was largely absent against video | Misinformation | [Schiff, Schiff and Bueno, APSR 2025](https://www.cambridge.org/core/journals/american-political-science-review/article/liars-dividend-can-politicians-claim-misinformation-to-evade-accountability/687FEE54DBD7ED0C96D72B26606AA073) |
| The liar's dividend. Once fakes are possible, real evidence becomes deniable | Misinformation notes | [Chesney and Citron, California Law Review 2019](https://doi.org/10.15779/Z38RV0D15J) |
| In fact-checked media misinformation, simple context manipulations outnumbered AI-generated content, even as AI content rose. Preprint | Misinformation | [Dufour et al., 2024](https://arxiv.org/abs/2405.11697) |
| Encouraging people to search raised belief in false stories when results were low quality | Frameworks | [Aslett et al., Nature 2024](https://doi.org/10.1038/s41586-023-06883-y) |
| Fact-checks and literacy tips cut belief in false information and in true information | Frameworks | [Hoes et al., Nature Human Behaviour 2024](https://doi.org/10.1038/s41562-024-01884-x) |
| An hour-long literacy session for 1,224 adults produced no average improvement | Frameworks | [Badrinathan, APSR 2021](https://doi.org/10.1017/S0003055421000459) |
| Provenance mostly lowered trust, and incomplete or invalid states led people to doubt honest media (N = 595) | Concern map | [Feng et al., CSCW 2023](https://arxiv.org/abs/2303.12118) |
| Unlabelled images read as slightly more authentic once labels exist | Concern map | [Pawelczyk et al., ICWSM 2026](https://ojs.aaai.org/index.php/ICWSM/article/view/42721) |
| AI labels led to overreliance and to doubt of true claims shown with labelled AI images | Concern map | [Höltervennhoff et al., CHI 2026](https://arxiv.org/abs/2505.22845) |
| "AI-generated" labels are read as full automation | Concern map | [Altay and Gilardi, PNAS Nexus 2024](https://academic.oup.com/pnasnexus/article/3/10/pgae403/7795946) |
| Spaced reinforcement restores decayed inoculation effects | Distribution | Maertens et al., Nature Communications 2025 |

## Our own data

| Claim as worded on the slide | Slide | Source |
| --- | --- | --- |
| 84.4% get news from social media daily, 9.4% weekly, 6.3% rarely | Pilot | Pilot study, June to July 2026 |
| 65.6% aren't familiar with any verification framework, 12.5% can't tell, 21.9% are | Pilot | Pilot study |
| 75% agree it is their responsibility to verify what they see (28.1% strongly, 46.9% somewhat), 21.9% neither, 3.1% strongly disagree | Pilot | Pilot study |
| 12 of 14 experts agree SIFT is still useful for AI-generated content (R9). 0 of 14 agree it gives enough guidance when a trustworthy source publishes a fabrication (R11). 1 of 14 when real content is wrongly called AI (R12) | Frameworks | Expert panel, preliminary, export of 5 Oct 2026 |

Open check. The pilot footnote says n = 46, but every pilot percentage is a multiple of 1/32. Confirm the per-question n before presenting.
