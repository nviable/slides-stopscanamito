// Slide order. Each slide is one HTML file holding one <section class="slide">.
// To add a slide, create the file and import it here in the right place.
// Tech team slides live in ./tech/ so both teams can edit without touching each other's files.

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
import techBuild from './tech/12-how-it-is-built.html?raw';
import techOrchestrator from './tech/12a-orchestrator.html?raw';
import techCaptions from './tech/12c-captions.html?raw';
import techDemo from './tech/13-demo.html?raw';
import techKeys from './tech/14-bring-your-own-keys.html?raw';
import asksOpening from './15-asks-opening.html?raw';
import concernMap from './16-concern-map.html?raw';
import fourAsks from './17-four-asks.html?raw';
import close from './18-close.html?raw';

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
  techBuild,
  techOrchestrator,
  techCaptions,
  techDemo,
  techKeys,
  asksOpening,
  concernMap,
  fourAsks,
  close
];
