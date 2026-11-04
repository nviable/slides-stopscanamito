// Slide order. Each slide is one HTML file holding one <section class="slide">.
// To add a slide, create the file and import it here in the right place.
// Tech team slides live in ./tech/ so both teams can edit without touching each other's files.
// Slides with data-auds="iui" belong to the IUI 2027 demo video and live in ./iui/.
// Slides without data-auds are the IPTC and JPEG Trust talk. The A key switches audience.

import title from './01-title.html?raw';
import misinformation from './02-misinformation.html?raw';
import pilot from './03-pilot.html?raw';
import manyHands from './04-many-hands.html?raw';
import twoFamilies from './05-two-families.html?raw';
import frameworks from './06-frameworks.html?raw';
import stopscan from './07-stopscan.html?raw';
import marcus from './08-marcus.html?raw';
import distribution from './09-distribution.html?raw';
import handoff from './10-handoff.html?raw';
import techIntro from './tech/11-introducing-amito.html?raw';
import techOrchestrator from './tech/12a-orchestrator.html?raw';
import techExplains from './tech/12c-plain-words.html?raw';
import techDemo from './tech/13-demo.html?raw';
// Bring your own model: out of the talk for now, its points live on the orchestrator slide.
// To bring it back, uncomment this import and techKeys in the list below.
// import techKeys from './tech/14-bring-your-own-keys.html?raw';
import asksOpening from './15-asks-opening.html?raw';
// Concern map: out of the talk for now, to keep the asks to about three minutes.
// To bring it back, uncomment this import and concernMap in the list below.
// import concernMap from './16-concern-map.html?raw';
import fourAsks from './17-four-asks.html?raw';
import close from './18-close.html?raw';

// IUI 2027 demo video, about five minutes. Only shown with the IUI audience.
import iuiTitle from './iui/01-title.html?raw';
import iuiMisinformation from './iui/02-misinformation.html?raw';
import iuiGap from './iui/03-gap.html?raw';
import iuiIntro from './iui/04-introducing-amito.html?raw';
import iuiOrchestrator from './iui/05-orchestrator.html?raw';
import iuiExplains from './iui/06-plain-words.html?raw';
import iuiDemo from './iui/07-demo.html?raw';
import iuiTogether from './iui/08-together.html?raw';
import iuiReport from './iui/09-trust-report.html?raw';
import iuiModular from './iui/10-modular.html?raw';
import iuiClose from './iui/11-close.html?raw';

export const slides = [
  title,
  misinformation,
  pilot,
  manyHands,
  twoFamilies,
  frameworks,
  stopscan,
  marcus,
  distribution,
  handoff,
  techIntro,
  techOrchestrator,
  techExplains,
  techDemo,
  // techKeys,
  asksOpening,
  // concernMap,
  fourAsks,
  close,

  iuiTitle,
  iuiMisinformation,
  iuiGap,
  iuiIntro,
  iuiOrchestrator,
  iuiExplains,
  iuiDemo,
  iuiTogether,
  iuiReport,
  iuiModular,
  iuiClose
];
