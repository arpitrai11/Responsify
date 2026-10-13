(function(p){"use strict";const v="rip-inspect-hover-overlay",x="rip-inspect-selected-overlay",C="rip-grid-overlay",T="rip-xray-styles",M="rip-dark-simulation-styles",I="rip-svg-filters";function oe(o){let t=document.getElementById(v);if(!t){t=document.createElement("div"),t.id=v,t.style.cssText=`
      position: absolute;
      pointer-events: none;
      z-index: 2147483640;
      border: 1.5px solid #6366f1;
      background-color: rgba(99, 102, 241, 0.15);
      box-sizing: border-box;
      transition: all 0.05s ease-out;
      border-radius: 2px;
    `;const n=document.createElement("div");n.className="rip-label",n.style.cssText=`
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      background: #1e1b4b;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      font-size: 11px;
      font-weight: 500;
      line-height: 1;
      padding: 3px 6px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(255,255,255,0.15);
    `,t.appendChild(n),document.documentElement.appendChild(t)}const e=o.getBoundingClientRect(),r=window.scrollX||window.pageXOffset,a=window.scrollY||window.pageYOffset;t.style.display="block",t.style.top=`${e.top+a}px`,t.style.left=`${e.left+r}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`;const s=t.querySelector(".rip-label");if(s){const n=o.tagName.toLowerCase(),l=o.id?`#${o.id}`:"",i=Array.from(o.classList).filter(u=>!u.startsWith("rip-")).slice(0,2).map(u=>`.${u}`).join(""),d=`${Math.round(e.width)} × ${Math.round(e.height)}`;s.innerHTML=`
      <span style="color: #a5b4fc; font-weight: 600;">${n}</span><span style="color: #fbbf24;">${l}</span><span style="color: #93c5fd;">${i}</span>
      <span style="color: #94a3b8; font-size: 10px; margin-left: 4px; border-left: 1px solid #475569; padding-left: 6px;">${d}</span>
    `,e.top<28?(s.style.bottom="auto",s.style.top="4px"):(s.style.top="auto",s.style.bottom="calc(100% + 4px)")}}function V(){const o=document.getElementById(v);o&&(o.style.display="none")}function f(o){let t=document.getElementById(x);t||(t=document.createElement("div"),t.id=x,t.style.cssText=`
      position: absolute;
      pointer-events: none;
      z-index: 2147483639;
      border: 2px dashed #3b82f6;
      background-color: rgba(59, 130, 246, 0.08);
      box-sizing: border-box;
      border-radius: 2px;
    `,document.documentElement.appendChild(t));const e=o.getBoundingClientRect(),r=window.scrollX||window.pageXOffset,a=window.scrollY||window.pageYOffset;t.style.display="block",t.style.top=`${e.top+a}px`,t.style.left=`${e.left+r}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`}function q(){const o=document.getElementById(x);o&&(o.style.display="none")}function k(o){let t=document.getElementById(T);o?t||(t=document.createElement("style"),t.id=T,t.textContent=`
        * {
          outline: 1px solid rgba(99, 102, 241, 0.3) !important;
        }
        div, section, article, main, aside, header, footer, nav {
          outline: 1px solid rgba(59, 130, 246, 0.4) !important;
          background-color: rgba(59, 130, 246, 0.02) !important;
        }
        [style*="display: flex"], [style*="display:flex"], .flex {
          outline: 1.5px solid rgba(236, 72, 153, 0.5) !important;
        }
        [style*="display: grid"], [style*="display:grid"], .grid {
          outline: 1.5px solid rgba(6, 182, 212, 0.5) !important;
        }
        h1, h2, h3, h4, h5, h6, p, span, a, button {
          outline: 1px dashed rgba(245, 158, 11, 0.4) !important;
        }
        img, svg, picture, video, canvas {
          outline: 1.5px solid rgba(16, 185, 129, 0.6) !important;
        }
      `,document.head.appendChild(t)):t&&t.remove()}function L(o,t){let e=document.getElementById(C);if(!o){e&&e.remove();return}e||(e=document.createElement("div"),e.id=C,document.documentElement.appendChild(e));const{columns:r,gutter:a,margin:s,color:n,opacity:l}=t;e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483641;
    display: flex;
    box-sizing: border-box;
    padding: 0 ${s}px;
    gap: ${a}px;
  `,e.innerHTML="";for(let i=0;i<r;i++){const d=document.createElement("div");d.style.cssText=`
      flex: 1;
      height: 100%;
      background-color: ${n};
      opacity: ${l};
      border-left: 1px dashed ${n};
      border-right: 1px dashed ${n};
      box-sizing: border-box;
    `,e.appendChild(d)}}function _(o){let t=document.getElementById(M);o==="simulated"?t||(t=document.createElement("style"),t.id=M,t.textContent=`
        html {
          filter: invert(0.88) hue-rotate(180deg) !important;
          background: #111 !important;
        }
        img, picture, video, canvas, svg, [style*="background-image"] {
          filter: invert(1.14) hue-rotate(180deg) !important;
        }
      `,document.head.appendChild(t)):t&&t.remove()}function A(o){let t=document.getElementById(I);if(o==="none"){document.documentElement.style.removeProperty("filter"),t&&t.remove();return}t||(t=document.createElement("div"),t.id=I,t.style.cssText="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;",t.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="rip-protanopia">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0   0.558, 0.442, 0, 0, 0   0, 0.242, 0.758, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-deuteranopia">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0   0.7, 0.3, 0, 0, 0   0, 0.3, 0.7, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-tritanopia">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0   0, 0.433, 0.567, 0, 0   0, 0.475, 0.525, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-achromatopsia">
          <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0   0.299, 0.587, 0.114, 0, 0   0.299, 0.587, 0.114, 0, 0   0, 0, 0, 1, 0" />
        </filter>
      </svg>
    `,document.documentElement.appendChild(t)),document.documentElement.style.filter=`url(#rip-${o})`}function re(){var o,t,e,r,a,s;V(),q(),k(!1),L(!1,{columns:12,gutter:20,margin:32,color:"#6366f1",opacity:.15}),_("disabled"),A("none"),(o=document.getElementById(v))==null||o.remove(),(t=document.getElementById(x))==null||t.remove(),(e=document.getElementById(C))==null||e.remove(),(r=document.getElementById(T))==null||r.remove(),(a=document.getElementById(M))==null||a.remove(),(s=document.getElementById(I))==null||s.remove()}function P(o){var a,s;if(!o)return null;const t=o.trim().toLowerCase();if(t==="transparent"||t==="rgba(0, 0, 0, 0)")return{r:0,g:0,b:0,a:0};if(t.startsWith("#")){const n=t.slice(1);if(n.length===3)return{r:parseInt(n[0]+n[0],16),g:parseInt(n[1]+n[1],16),b:parseInt(n[2]+n[2],16),a:1};if(n.length===4)return{r:parseInt(n[0]+n[0],16),g:parseInt(n[1]+n[1],16),b:parseInt(n[2]+n[2],16),a:parseInt(n[3]+n[3],16)/255};if(n.length===6)return{r:parseInt(n.slice(0,2),16),g:parseInt(n.slice(2,4),16),b:parseInt(n.slice(4,6),16),a:1};if(n.length===8)return{r:parseInt(n.slice(0,2),16),g:parseInt(n.slice(2,4),16),b:parseInt(n.slice(4,6),16),a:parseInt(n.slice(6,8),16)/255}}const e=t.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);if(e)return{r:Math.min(255,Math.max(0,parseFloat(e[1]))),g:Math.min(255,Math.max(0,parseFloat(e[2]))),b:Math.min(255,Math.max(0,parseFloat(e[3]))),a:e[4]!==void 0?Math.min(1,Math.max(0,parseFloat(e[4]))):1};const r=t.match(/rgba?\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/);if(r){let n=1;return r[4]&&(n=r[4].endsWith("%")?parseFloat(r[4])/100:parseFloat(r[4])),{r:Math.min(255,Math.max(0,parseFloat(r[1]))),g:Math.min(255,Math.max(0,parseFloat(r[2]))),b:Math.min(255,Math.max(0,parseFloat(r[3]))),a:Math.min(1,Math.max(0,n))}}if(typeof document<"u"){const n=document.createElement("div");n.style.color=t,(a=document.body)==null||a.appendChild(n);const l=window.getComputedStyle(n).color;if((s=document.body)==null||s.removeChild(n),l&&l!==t)return P(l)}return null}function G(o){const t=Math.round(o.r).toString(16).padStart(2,"0"),e=Math.round(o.g).toString(16).padStart(2,"0"),r=Math.round(o.b).toString(16).padStart(2,"0");if(o.a<1){const a=Math.round(o.a*255).toString(16).padStart(2,"0");return`#${t}${e}${r}${a}`}return`#${t}${e}${r}`}function U(o){const t=s=>{const n=s/255;return n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4)},e=t(o.r),r=t(o.g),a=t(o.b);return .2126*e+.7152*r+.0722*a}function K(o,t={r:255,g:255,b:255,a:1}){const e=o.a+t.a*(1-o.a);return e===0?{r:255,g:255,b:255,a:1}:{r:Math.round((o.r*o.a+t.r*t.a*(1-o.a))/e),g:Math.round((o.g*o.a+t.g*t.a*(1-o.a))/e),b:Math.round((o.b*o.a+t.b*t.a*(1-o.a))/e),a:Math.min(1,e)}}function ne(o,t){const e=P(o)||{r:0,g:0,b:0,a:1};let r=P(t)||{r:255,g:255,b:255,a:1},a=!1,s="";r.a<1&&(a=!0,r=K(r,{r:255,g:255,b:255,a:1}),s="Background has transparency; composited over white");const n=e.a<1?K(e,r):e,l=U(n),i=U(r),d=Math.max(l,i),u=Math.min(l,i),z=(d+.05)/(u+.05),y=parseFloat(z.toFixed(2));return{foreground:G(n),background:G(r),ratio:y,aaNormal:y>=4.5,aaLarge:y>=3,aaaNormal:y>=7,aaaLarge:y>=4.5,isEstimated:a,note:s}}function m(o){if(!(o instanceof Element))return"";if(o.id&&document.querySelectorAll(`#${CSS.escape(o.id)}`).length===1)return`#${CSS.escape(o.id)}`;const t=[];let e=o;for(;e&&e!==document.documentElement&&e!==document.body;){let r=e.tagName.toLowerCase();if(e.id){r=`#${CSS.escape(e.id)}`,t.unshift(r);break}else{const a=Array.from(e.classList).filter(s=>!s.startsWith("rip-")&&!s.includes(":")&&!s.includes("[")).slice(0,2);if(a.length>0&&(r+=`.${a.map(s=>CSS.escape(s)).join(".")}`),e.parentElement){const s=Array.from(e.parentElement.children).filter(n=>n.tagName===e.tagName);if(s.length>1){const n=s.indexOf(e)+1;r+=`:nth-of-type(${n})`}}}t.unshift(r),e=e.parentElement}return t.join(" > ")||o.tagName.toLowerCase()}function ae(o){const t=window.getComputedStyle(o),e=d=>{const u=parseFloat(d);return isNaN(u)?0:Math.round(u)},r=o.getBoundingClientRect(),a={top:e(t.paddingTop),right:e(t.paddingRight),bottom:e(t.paddingBottom),left:e(t.paddingLeft)},s={top:e(t.borderTopWidth),right:e(t.borderRightWidth),bottom:e(t.borderBottomWidth),left:e(t.borderLeftWidth)},n={top:e(t.marginTop),right:e(t.marginRight),bottom:e(t.marginBottom),left:e(t.marginLeft)},l=Math.max(0,Math.round(r.width-a.left-a.right-s.left-s.right)),i=Math.max(0,Math.round(r.height-a.top-a.bottom-s.top-s.bottom));return{margin:n,border:s,padding:a,content:{width:l,height:i}}}function se(o){const t=[];let e=o;for(;e&&e!==document.documentElement;)t.unshift({tagName:e.tagName.toLowerCase(),id:e.id||"",classList:Array.from(e.classList).filter(r=>!r.startsWith("rip-")),selector:m(e)}),e=e.parentElement;return t}function ie(o){let t=o;for(;t;){const e=window.getComputedStyle(t).backgroundColor;if(e&&e!=="transparent"&&e!=="rgba(0, 0, 0, 0)")return e;t=t.parentElement}return"rgb(255, 255, 255)"}function j(o){const t=window.getComputedStyle(o),e=o.getBoundingClientRect(),r=m(o),a=ae(o),s=se(o),n=["display","position","flex-direction","justify-content","align-items","gap","grid-template-columns","grid-template-rows","width","height","max-width","min-width","margin","padding","font-family","font-size","font-weight","line-height","letter-spacing","text-align","color","background-color","border-color","border-width","border-radius","box-shadow","opacity","z-index","overflow","cursor","transition"],l={};for(const h of n)l[h]=t.getPropertyValue(h);const i={};if(o instanceof HTMLElement)for(let h=0;h<o.style.length;h++){const te=o.style[h];i[te]=o.style.getPropertyValue(te)}const d=t.color,u=ie(o),z=t.borderColor,y=ne(d,u);return{tagName:o.tagName.toLowerCase(),id:o.id||"",classList:Array.from(o.classList).filter(h=>!h.startsWith("rip-")),selector:r,rect:{top:Math.round(e.top+window.scrollY),left:Math.round(e.left+window.scrollX),width:Math.round(e.width),height:Math.round(e.height)},boxModel:a,computedStyles:l,inlineStyles:i,textContent:(o.textContent||"").trim().slice(0,150),parentHierarchy:s,childrenCount:o.children.length,colors:{color:d,backgroundColor:u,borderColor:z},contrast:y,isInteractive:["A","BUTTON","INPUT","SELECT","TEXTAREA"].includes(o.tagName)}}let b=!1,c=null,R=null;const E=new WeakMap,w=new WeakMap,g=new WeakMap;function J(o){if(!b)return;const e=document.elementsFromPoint(o.clientX,o.clientY).find(r=>!r.id.startsWith("rip-")&&!r.closest("#rip-inspect-hover-overlay")&&!r.closest("#rip-grid-overlay"));e&&e!==R&&e!==document.documentElement&&e!==document.body&&(R=e,oe(e))}function Q(o){var r,a;if(!b)return;o.preventDefault(),o.stopPropagation();const e=document.elementsFromPoint(o.clientX,o.clientY).find(s=>!s.id.startsWith("rip-")&&!s.closest("#rip-inspect-hover-overlay")&&!s.closest("#rip-grid-overlay"));e&&e instanceof HTMLElement&&(ee(e),S(),(a=(r=chrome.runtime)==null?void 0:r.sendMessage)==null||a.call(r,{action:"ELEMENT_SELECTED",payload:j(e)}).catch(()=>{}),window.parent&&window.parent!==window&&window.parent.postMessage({action:"ELEMENT_SELECTED",payload:j(e)},"*"))}function Z(o){var t,e;o.key==="Escape"&&b&&(S(),(e=(t=chrome.runtime)==null?void 0:t.sendMessage)==null||e.call(t,{action:"STOP_PICKER"}).catch(()=>{}),window.parent&&window.parent!==window&&window.parent.postMessage({action:"STOP_PICKER"},"*"))}function $(){b=!0,document.addEventListener("mousemove",J,!0),document.addEventListener("click",Q,!0),document.addEventListener("keydown",Z,!0),document.body.style.cursor="crosshair"}function S(){b=!1,R=null,V(),document.removeEventListener("mousemove",J,!0),document.removeEventListener("click",Q,!0),document.removeEventListener("keydown",Z,!0),document.body.style.cursor=""}function ee(o){c=o,f(o)}function N(){c=null,q()}function O(o,t,e){const r=c&&m(c)===o?c:document.querySelector(o);if(!r)return{success:!1,error:"Element not found"};E.has(r)||E.set(r,new Map);const a=E.get(r);return a.has(t)||a.set(t,r.style.getPropertyValue(t)||""),r.style.setProperty(t,e,"important"),f(r),{success:!0}}function B(o,t){const e=c&&m(c)===o?c:document.querySelector(o);if(!e)return{success:!1,error:"Element not found"};const r=E.get(e);if(r&&r.has(t)){const a=r.get(t);a?e.style.setProperty(t,a):e.style.removeProperty(t)}else e.style.removeProperty(t);return f(e),{success:!0}}function D(o){const t=c&&m(c)===o?c:document.querySelector(o);if(!t)return{success:!1,error:"Element not found"};const e=E.get(t);return e&&(e.forEach((r,a)=>{r?t.style.setProperty(a,r):t.style.removeProperty(a)}),E.delete(t)),f(t),{success:!0}}function Y(o,t){const e=c&&m(c)===o?c:document.querySelector(o);return e?(w.has(e)||w.set(e,e.textContent||""),e.textContent=t,f(e),{success:!0}):{success:!1,error:"Element not found"}}function W(o){const t=c&&m(c)===o?c:document.querySelector(o);return t?(w.has(t)&&(t.textContent=w.get(t),w.delete(t)),f(t),{success:!0}):{success:!1,error:"Element not found"}}function H(o,t){const e=c&&m(c)===o?c:document.querySelector(o);return e?(e instanceof HTMLImageElement?(g.has(e)||g.set(e,e.src),e.src=t):(g.has(e)||g.set(e,e.style.backgroundImage||""),e.style.backgroundImage=`url("${t}")`),f(e),{success:!0}):{success:!1,error:"Element not found"}}function X(o){const t=c&&m(c)===o?c:document.querySelector(o);if(!t)return{success:!1,error:"Element not found"};if(g.has(t)){const e=g.get(t);t instanceof HTMLImageElement?t.src=e:t.style.backgroundImage=e,g.delete(t)}return f(t),{success:!0}}function F(){const o=[],t=new Set;Array.from(document.querySelectorAll("img")).forEach((n,l)=>{const i=n.currentSrc||n.src;i&&!i.startsWith("chrome-extension://")&&!t.has(i)&&(t.add(i),o.push({id:`img-${l}`,type:"image",url:i,altText:n.alt||"",dimensions:{width:n.naturalWidth||n.clientWidth,height:n.naturalHeight||n.clientHeight}}))}),Array.from(document.querySelectorAll("svg")).forEach((n,l)=>{if(n.closest("#rip-svg-filters")||n.closest("#rip-inspect-hover-overlay"))return;const i=n.getBoundingClientRect(),u=new XMLSerializer().serializeToString(n);o.push({id:`svg-${l}`,type:"svg",url:`data:image/svg+xml;utf8,${encodeURIComponent(u)}`,altText:n.getAttribute("aria-label")||n.getAttribute("name")||`SVG Icon #${l+1}`,dimensions:{width:Math.round(i.width)||24,height:Math.round(i.height)||24},isInlineSvg:!0,svgContent:u})});const a=Array.from(document.querySelectorAll("*"));let s=0;for(const n of a){if(n.id.startsWith("rip-"))continue;const i=window.getComputedStyle(n).backgroundImage;if(i&&i!=="none"&&i.startsWith("url(")){const d=i.match(/url\(['"]?(.*?)['"]?\)/);if(d&&d[1]&&!t.has(d[1])){t.add(d[1]);const u=n.getBoundingClientRect();o.push({id:`bg-${s++}`,type:"background-image",url:d[1],altText:`Background on <${n.tagName.toLowerCase()}>`,dimensions:{width:Math.round(u.width),height:Math.round(u.height)}})}}}return o.slice(0,100)}chrome.runtime.onMessage.addListener((o,t,e)=>{switch(o.action){case"PING":e({success:!0});break;case"START_PICKER":$(),e({success:!0});break;case"STOP_PICKER":S(),e({success:!0});break;case"CLEAR_SELECTION":N(),e({success:!0});break;case"APPLY_CSS":{const r=o.payload,a=O(r.selector,r.property,r.value);e(a);break}case"REMOVE_CSS":{const r=o.payload,a=B(r.selector,r.property);e(a);break}case"RESET_ELEMENT_CSS":{const r=o.payload,a=D(r.selector);e(a);break}case"UPDATE_TEXT":{const r=o.payload,a=Y(r.selector,r.text);e(a);break}case"RESET_TEXT":{const r=o.payload,a=W(r.selector);e(a);break}case"UPDATE_IMAGE":{const r=o.payload,a=H(r.selector,r.src);e(a);break}case"RESET_IMAGE":{const r=o.payload,a=X(r.selector);e(a);break}case"SET_XRAY":{const r=o.payload;k(r.enabled),e({success:!0});break}case"SET_GRID":{const r=o.payload;L(r.enabled,r.config),e({success:!0});break}case"SET_DARK_THEME":{const r=o.payload;_(r.mode),e({success:!0});break}case"SET_COLOR_BLINDNESS":{const r=o.payload;A(r.type),e({success:!0});break}case"DISCOVER_ASSETS":{const r=F();e({success:!0,data:r});break}case"SYNC_SCROLL":{const r=o.payload;window.scrollTo({left:r.scrollX,top:r.scrollY,behavior:"auto"}),e({success:!0});break}case"SYNC_SCROLL_DELTA":{const r=o.payload;window.scrollBy({top:r.deltaY,behavior:"auto"}),e({success:!0});break}case"GET_PAGE_INFO":{e({success:!0,data:{title:document.title,url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio}}});break}default:e({success:!1,error:"Unknown action"})}return!0}),window.addEventListener("message",o=>{if(!o.data||!o.data.action)return;const{action:t,payload:e}=o.data;switch(t){case"SYNC_SCROLL_DELTA":{const r=typeof(e==null?void 0:e.deltaY)=="number"?e.deltaY:o.data.deltaY||0;window.scrollBy({top:r,behavior:"auto"});break}case"SYNC_SCROLL_PERCENT":{const r=typeof(e==null?void 0:e.percent)=="number"?e.percent:o.data.percent||0,a=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);window.scrollTo({top:r*a,behavior:"auto"});break}case"START_PICKER":$();break;case"STOP_PICKER":S();break;case"CLEAR_SELECTION":N();break;case"APPLY_CSS":e&&e.selector&&e.property&&O(e.selector,e.property,e.value);break;case"REMOVE_CSS":e&&e.selector&&e.property&&B(e.selector,e.property);break;case"RESET_ELEMENT_CSS":e&&e.selector&&D(e.selector);break;case"UPDATE_TEXT":e&&e.selector&&Y(e.selector,e.text);break;case"RESET_TEXT":e&&e.selector&&W(e.selector);break;case"UPDATE_IMAGE":e&&e.selector&&e.src&&H(e.selector,e.src);break;case"RESET_IMAGE":e&&e.selector&&X(e.selector);break;case"SET_XRAY":e&&k(!!e.enabled);break;case"SET_GRID":e&&L(!!e.enabled,e.config);break;case"SET_DARK_THEME":e&&_(e.mode);break;case"SET_COLOR_BLINDNESS":e&&A(e.type);break;case"DISCOVER_ASSETS":{const r=F();window.parent&&window.parent!==window&&window.parent.postMessage({action:"ASSETS_DISCOVERED",payload:r},"*");break}}}),window.addEventListener("beforeunload",()=>{re()}),p.applyCss=O,p.clearSelection=N,p.discoverPageAssets=F,p.removeCss=B,p.resetElementCss=D,p.resetImage=X,p.resetText=W,p.selectTargetElement=ee,p.startPicker=$,p.stopPicker=S,p.updateImage=H,p.updateText=Y,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})})(this.ResponsiveInspectorContent=this.ResponsiveInspectorContent||{});
