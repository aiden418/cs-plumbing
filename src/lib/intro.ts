/**
 * The Opening (chrome-and-opening.md section 8): the two inline scripts that
 * run before the first paint of the homepage.
 *
 * 1. INTRO_SCRIPT, in <head> (IntroHead): decides whether the Opening plays,
 *    sets <html data-intro="wait">, writes the seen flag, owns the skip
 *    listeners and the single clock, and ends the Opening (removes the
 *    attribute, dispatches `cs:intro-done`). It always leaves
 *    `window.__csHero` (the debug record the preview ribbon reads) and
 *    `window.__csIntro` (the handle the other script and HeroController use).
 * 2. frameScript(), directly after the hero <video>: on the intro path it
 *    measures the frame and the stage and writes the transform as CSS
 *    variables on the frame, then picks the film from an inlined table and
 *    calls play(). When the first frame is presented it starts the beat.
 *
 * Both are plain ES2017 strings (no build step touches them) and are
 * unit-tested in node:vm by tests/intro-script.test.ts. Only code written
 * here goes into them, never user input.
 */
import variants from "../../public/videos/hero/variants.json";
import { MID_MAX_WIDTH, MOTION_KEY, PHONE_MEDIA, toSources, type HeroSource } from "@/lib/hero-controller";

/** localStorage key holding the time (ms) the Opening last started. */
export const SEEN_KEY = "cs-intro-seen";
/** The Opening plays again after this many days. */
export const SEEN_DAYS = 30;
/** No first frame within this time: skip to the settled hero. */
export const FIRST_FRAME_CAP_MS = 1000;
/** Hold on the full film before the frame settles. */
export const HOLD_MS = { desktop: 900, phone: 600 } as const;
/** The frame's settle into the hero (the CSS uses the same value). */
export const SETTLE_MS = 900;
/** The skip transition (the CSS uses 180 ms). */
export const SKIP_MS = 200;
/** Where navigator.connection is missing: the document's own response must start within this. */
export const QUICK_RESPONSE_MS = 600;

/** Every playable cut of the film, in try order (public/videos/hero/variants.json). */
export const HERO_SOURCES: HeroSource[] = toSources(variants);

const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** The audience rule shared by both scripts (same as audienceFor in hero-controller.ts). */
const AUDIENCE_FN = `function aud(w){return w.matchMedia(${json(PHONE_MEDIA)}).matches?"portrait-phone":w.innerWidth<=${MID_MAX_WIDTH}||w.matchMedia("(pointer: coarse)").matches?"up-to-1023":"desktop"}`;

export function buildIntroScript(sources: readonly HeroSource[] = HERO_SOURCES): string {
  const audiences = [...new Set(sources.map((s) => s.audience))];
  return `(function(w,d){
var h=d.documentElement,P=w.performance,n=w.navigator,l=w.location,now=Date.now(),
H=w.__csHero={intro:"ineligible:unknown",file:"none",autoplay:"n/a",state:"idle"},
I=w.__csIntro={s:null,r:"",path:l.pathname},t=0,
q=/[?&]intro=([01])(?:&|#|$)/.exec(l.search),f=q?q[1]:"",r="";
${AUDIENCE_FN}
function dbg(){try{d.dispatchEvent(new Event("cs:hero-debug"))}catch(e){}}
function mark(m){try{P.mark(m)}catch(e){}}
function ls(k){try{return w.localStorage.getItem(k)}catch(e){return false}}
try{
var c=n.connection,v=P&&P.getEntriesByType?P.getEntriesByType("navigation")[0]:null,s=ls(${json(SEEN_KEY)});
if(f==="0")r="param";
else if(l.pathname!=="/"||l.hash)r="path";
else if(v&&v.type==="back_forward")r="history";
else if(f!=="1"&&(s===false||(s&&now-Number(s)<${SEEN_DAYS * 864e5})))r="seen";
else if(w.matchMedia("(prefers-reduced-motion: reduce)").matches)r="reduced-motion";
else if(c&&c.saveData)r="save-data";
else if(c?/(^|-)(2g|3g)$/.test(c.effectiveType||""):!(v&&v.responseStart>0&&v.responseStart-v.requestStart<${QUICK_RESPONSE_MS}))r="slow";
else if(d.visibilityState!=="visible")r="hidden";
else if(${json(audiences)}.indexOf(aud(w))<0)r="no-variant";
else if(w.innerHeight<420)r="short";
else if(f!=="1"&&n.webdriver)r="webdriver";
else if(ls(${json(MOTION_KEY)})==="off")r="paused";
}catch(e){r="error"}
I.r=r;
if(r){H.intro="ineligible:"+r;dbg();return}
var O={capture:true,passive:true},E=["keydown","wheel","touchstart","pointerdown"];
function set(x){I.s=x;h.setAttribute("data-intro",x)}
function clock(fn,ms){clearTimeout(t);t=setTimeout(function(){try{fn()}catch(e){done()}},ms)}
function keep(x){return x&&x.closest&&x.closest("header a,header button,[data-drawer-hide] a,[data-drawer-hide] button,[data-intro-keep]")}
function skipEl(x){return x&&x.closest&&x.closest("[data-intro-skip]")}
function on(e){if(e.type!=="keydown"&&e.type!=="wheel"&&!skipEl(e.target)&&keep(e.target))return;skip(skipEl(e.target)?"button":e.type)}
function click(e){if(skipEl(e.target))skip("button")}
function scroll(){skip("scroll")}
function vis(){if(d.visibilityState!=="visible")skip("hidden")}
function resize(){if(I.measure)I.measure()}
function end(e){if(e.target&&e.target.id==="cs-hero-frame"&&e.propertyName==="transform"&&(I.s==="skip"||h.hasAttribute("data-intro-settle")))done()}
function listen(a){var m=a?"addEventListener":"removeEventListener",i;for(i=0;i<E.length;i++)w[m](E[i],on,O);w[m]("scroll",scroll,O);w[m]("resize",resize,O);d[m]("click",click,true);d[m]("visibilitychange",vis,true);d[m]("transitionend",end,true)}
function settle(){h.setAttribute("data-intro-settle","");mark("intro:settle-start");clock(done,${SETTLE_MS + 300})}
function skip(why){if(I.s!=="wait"&&I.s!=="play")return;I.why=why;H.intro="skipped";h.removeAttribute("data-intro-settle");set("skip");mark("intro:settle-start");dbg();clock(done,${SKIP_MS + 60})}
function play(){if(I.s!=="wait")return;set("play");mark("intro:first-frame");dbg();clock(settle,aud(w)==="portrait-phone"?${HOLD_MS.phone}:${HOLD_MS.desktop})}
function done(){if(I.s==="done")return;clearTimeout(t);listen(false);var a=d.activeElement,b;I.s="done";h.removeAttribute("data-intro");h.removeAttribute("data-intro-settle");mark("intro:done");
if(skipEl(a)&&(b=d.querySelector("[data-intro-focus]")))b.focus();
try{d.dispatchEvent(new Event("cs:intro-done"))}catch(e){}dbg()}
I.play=play;I.skip=skip;I.done=done;
set("wait");H.intro="played";
try{w.localStorage.setItem(${json(SEEN_KEY)},String(now))}catch(e){}
mark("intro:start");listen(true);clock(function(){skip("no-frame")},${FIRST_FRAME_CAP_MS});dbg();
})(window,document);`.replace(/\n/g, "");
}

/** The head script, as rendered by IntroHead. */
export const INTRO_SCRIPT = buildIntroScript();

/**
 * The script placed directly after the hero <video>. It needs the frame
 * (#cs-hero-frame), the video (#cs-hero-video) and the stage
 * (#cs-intro-stage) to exist above it in the HTML.
 */
export function frameScript(sources: readonly HeroSource[] = HERO_SOURCES): string {
  const table = sources.map((s) => ({ f: s.file, a: s.audience, t: s.type, h: s.hevc, w: s.width, y: s.height, b: s.bitrate }));
  return `(function(w,d){
var I=w.__csIntro,H=w.__csHero,F=d.getElementById("cs-hero-frame"),V=d.getElementById("cs-hero-video"),S=d.getElementById("cs-intro-stage"),x=0,y=0,T=${json(table)};
if(!I||I.s!=="wait"||!F||!V||!S)return;
${AUDIENCE_FN}
function dbg(){try{d.dispatchEvent(new Event("cs:hero-debug"))}catch(e){}}
function measure(){if(I.s!=="wait"&&I.s!=="play")return;if(d.documentElement.hasAttribute("data-intro-settle"))return;
var s=S.getBoundingClientRect(),r=F.getBoundingClientRect(),fw=F.offsetWidth,fh=F.offsetHeight;if(!fw||!fh||!s.width||!s.height)return;
var k=Math.min(s.width/fw,s.height/fh);x=s.left+s.width/2-(r.left+r.width/2-x);y=s.top+s.height/2-(r.top+r.height/2-y);
F.style.setProperty("--intro-x",x.toFixed(1)+"px");F.style.setProperty("--intro-y",y.toFixed(1)+"px");F.style.setProperty("--intro-k",k.toFixed(4))}
measure();I.measure=measure;if(d.fonts&&d.fonts.ready)d.fonts.ready.then(measure);
var a=aud(w),list=[],i;for(i=0;i<T.length;i++)if(T[i].a===a)list.push(T[i]);
function first(){if(I.ff)return;I.ff=1;H.autoplay="ok";try{w.performance.mark("video:first-frame")}catch(e){}F.setAttribute("data-film","on");dbg();I.play()}
function start(c,j){var s=c[j];I.idx=j;if(!s){H.file="none";dbg();return}
function err(){V.removeEventListener("error",err);if(I.idx===j)start(c,j+1)}
V.addEventListener("error",err);V.muted=true;V.src=s.f;H.file=s.f;dbg();
if(V.requestVideoFrameCallback)V.requestVideoFrameCallback(first);else V.addEventListener("playing",first,{once:true});
var p=V.play();if(p&&p.then)p.then(null,function(e){if(e&&e.name==="NotAllowedError"){H.autoplay="blocked";dbg();I.skip("autoplay")}})}
function go(hevc){var c=[],k;for(k=0;k<list.length;k++)if((hevc||!list[k].h)&&V.canPlayType(list[k].t))c.push(list[k]);I.files=[];for(k=0;k<c.length;k++)I.files.push(c[k].f);start(c,0)}
var m=w.navigator.mediaCapabilities,hv=null;for(i=0;i<list.length;i++)if(list[i].h)hv=list[i];
if(hv&&m&&m.decodingInfo)m.decodingInfo({type:"file",video:{contentType:hv.t,width:hv.w,height:hv.y,bitrate:hv.b,framerate:30}}).then(function(o){go(!!(o&&o.supported&&o.powerEfficient))},function(){go(false)});else go(false);
})(window,document);`.replace(/\n/g, "");
}
