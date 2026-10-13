(function(m){"use strict";const v="rip-inspect-hover-overlay",x="rip-inspect-selected-overlay",C="rip-grid-overlay",M="rip-xray-styles",T="rip-dark-simulation-styles",I="rip-svg-filters";function et(o){let e=document.getElementById(v);if(!e){e=document.createElement("div"),e.id=v,e.style.cssText=`
      position: absolute;
      pointer-events: none;
      z-index: 2147483640;
      border: 1.5px solid #6366f1;
      background-color: rgba(99, 102, 241, 0.15);
      box-sizing: border-box;
      transition: all 0.05s ease-out;
      border-radius: 2px;
    `;const r=document.createElement("div");r.className="rip-label",r.style.cssText=`
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
    `,e.appendChild(r),document.documentElement.appendChild(e)}const t=o.getBoundingClientRect(),n=window.scrollX||window.pageXOffset,a=window.scrollY||window.pageYOffset;e.style.display="block",e.style.top=`${t.top+a}px`,e.style.left=`${t.left+n}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`;const i=e.querySelector(".rip-label");if(i){const r=o.tagName.toLowerCase(),c=o.id?`#${o.id}`:"",s=Array.from(o.classList).filter(u=>!u.startsWith("rip-")).slice(0,2).map(u=>`.${u}`).join(""),d=`${Math.round(t.width)} × ${Math.round(t.height)}`;i.innerHTML=`
      <span style="color: #a5b4fc; font-weight: 600;">${r}</span><span style="color: #fbbf24;">${c}</span><span style="color: #93c5fd;">${s}</span>
      <span style="color: #94a3b8; font-size: 10px; margin-left: 4px; border-left: 1px solid #475569; padding-left: 6px;">${d}</span>
    `,t.top<28?(i.style.bottom="auto",i.style.top="4px"):(i.style.top="auto",i.style.bottom="calc(100% + 4px)")}}function $(){const o=document.getElementById(v);o&&(o.style.display="none")}function f(o){let e=document.getElementById(x);e||(e=document.createElement("div"),e.id=x,e.style.cssText=`
      position: absolute;
      pointer-events: none;
      z-index: 2147483639;
      border: 2px dashed #3b82f6;
      background-color: rgba(59, 130, 246, 0.08);
      box-sizing: border-box;
      border-radius: 2px;
    `,document.documentElement.appendChild(e));const t=o.getBoundingClientRect(),n=window.scrollX||window.pageXOffset,a=window.scrollY||window.pageYOffset;e.style.display="block",e.style.top=`${t.top+a}px`,e.style.left=`${t.left+n}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function A(){const o=document.getElementById(x);o&&(o.style.display="none")}function P(o){let e=document.getElementById(M);o?e||(e=document.createElement("style"),e.id=M,e.textContent=`
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
      `,document.head.appendChild(e)):e&&e.remove()}function B(o,e){let t=document.getElementById(C);if(!o){t&&t.remove();return}t||(t=document.createElement("div"),t.id=C,document.documentElement.appendChild(t));const{columns:n,gutter:a,margin:i,color:r,opacity:c}=e;t.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483641;
    display: flex;
    box-sizing: border-box;
    padding: 0 ${i}px;
    gap: ${a}px;
  `,t.innerHTML="";for(let s=0;s<n;s++){const d=document.createElement("div");d.style.cssText=`
      flex: 1;
      height: 100%;
      background-color: ${r};
      opacity: ${c};
      border-left: 1px dashed ${r};
      border-right: 1px dashed ${r};
      box-sizing: border-box;
    `,t.appendChild(d)}}function N(o){let e=document.getElementById(T);o==="simulated"?e||(e=document.createElement("style"),e.id=T,e.textContent=`
        html {
          filter: invert(0.88) hue-rotate(180deg) !important;
          background: #111 !important;
        }
        img, picture, video, canvas, svg, [style*="background-image"] {
          filter: invert(1.14) hue-rotate(180deg) !important;
        }
      `,document.head.appendChild(e)):e&&e.remove()}function O(o){let e=document.getElementById(I);if(o==="none"){document.documentElement.style.removeProperty("filter"),e&&e.remove();return}e||(e=document.createElement("div"),e.id=I,e.style.cssText="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;",e.innerHTML=`
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
    `,document.documentElement.appendChild(e)),document.documentElement.style.filter=`url(#rip-${o})`}function ot(){var o,e,t,n,a,i;$(),A(),P(!1),B(!1,{columns:12,gutter:20,margin:32,color:"#6366f1",opacity:.15}),N("disabled"),O("none"),(o=document.getElementById(v))==null||o.remove(),(e=document.getElementById(x))==null||e.remove(),(t=document.getElementById(C))==null||t.remove(),(n=document.getElementById(M))==null||n.remove(),(a=document.getElementById(T))==null||a.remove(),(i=document.getElementById(I))==null||i.remove()}function L(o){var a,i;if(!o)return null;const e=o.trim().toLowerCase();if(e==="transparent"||e==="rgba(0, 0, 0, 0)")return{r:0,g:0,b:0,a:0};if(e.startsWith("#")){const r=e.slice(1);if(r.length===3)return{r:parseInt(r[0]+r[0],16),g:parseInt(r[1]+r[1],16),b:parseInt(r[2]+r[2],16),a:1};if(r.length===4)return{r:parseInt(r[0]+r[0],16),g:parseInt(r[1]+r[1],16),b:parseInt(r[2]+r[2],16),a:parseInt(r[3]+r[3],16)/255};if(r.length===6)return{r:parseInt(r.slice(0,2),16),g:parseInt(r.slice(2,4),16),b:parseInt(r.slice(4,6),16),a:1};if(r.length===8)return{r:parseInt(r.slice(0,2),16),g:parseInt(r.slice(2,4),16),b:parseInt(r.slice(4,6),16),a:parseInt(r.slice(6,8),16)/255}}const t=e.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);if(t)return{r:Math.min(255,Math.max(0,parseFloat(t[1]))),g:Math.min(255,Math.max(0,parseFloat(t[2]))),b:Math.min(255,Math.max(0,parseFloat(t[3]))),a:t[4]!==void 0?Math.min(1,Math.max(0,parseFloat(t[4]))):1};const n=e.match(/rgba?\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/);if(n){let r=1;return n[4]&&(r=n[4].endsWith("%")?parseFloat(n[4])/100:parseFloat(n[4])),{r:Math.min(255,Math.max(0,parseFloat(n[1]))),g:Math.min(255,Math.max(0,parseFloat(n[2]))),b:Math.min(255,Math.max(0,parseFloat(n[3]))),a:Math.min(1,Math.max(0,r))}}if(typeof document<"u"){const r=document.createElement("div");r.style.color=e,(a=document.body)==null||a.appendChild(r);const c=window.getComputedStyle(r).color;if((i=document.body)==null||i.removeChild(r),c&&c!==e)return L(c)}return null}function R(o){const e=Math.round(o.r).toString(16).padStart(2,"0"),t=Math.round(o.g).toString(16).padStart(2,"0"),n=Math.round(o.b).toString(16).padStart(2,"0");if(o.a<1){const a=Math.round(o.a*255).toString(16).padStart(2,"0");return`#${e}${t}${n}${a}`}return`#${e}${t}${n}`}function Y(o){const e=i=>{const r=i/255;return r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4)},t=e(o.r),n=e(o.g),a=e(o.b);return .2126*t+.7152*n+.0722*a}function W(o,e={r:255,g:255,b:255,a:1}){const t=o.a+e.a*(1-o.a);return t===0?{r:255,g:255,b:255,a:1}:{r:Math.round((o.r*o.a+e.r*e.a*(1-o.a))/t),g:Math.round((o.g*o.a+e.g*e.a*(1-o.a))/t),b:Math.round((o.b*o.a+e.b*e.a*(1-o.a))/t),a:Math.min(1,t)}}function nt(o,e){const t=L(o)||{r:0,g:0,b:0,a:1};let n=L(e)||{r:255,g:255,b:255,a:1},a=!1,i="";n.a<1&&(a=!0,n=W(n,{r:255,g:255,b:255,a:1}),i="Background has transparency; composited over white");const r=t.a<1?W(t,n):t,c=Y(r),s=Y(n),d=Math.max(c,s),u=Math.min(c,s),_=(d+.05)/(u+.05),y=parseFloat(_.toFixed(2));return{foreground:R(r),background:R(n),ratio:y,aaNormal:y>=4.5,aaLarge:y>=3,aaaNormal:y>=7,aaaLarge:y>=4.5,isEstimated:a,note:i}}function p(o){if(!(o instanceof Element))return"";if(o.id&&document.querySelectorAll(`#${CSS.escape(o.id)}`).length===1)return`#${CSS.escape(o.id)}`;const e=[];let t=o;for(;t&&t!==document.documentElement&&t!==document.body;){let n=t.tagName.toLowerCase();if(t.id){n=`#${CSS.escape(t.id)}`,e.unshift(n);break}else{const a=Array.from(t.classList).filter(i=>!i.startsWith("rip-")&&!i.includes(":")&&!i.includes("[")).slice(0,2);if(a.length>0&&(n+=`.${a.map(i=>CSS.escape(i)).join(".")}`),t.parentElement){const i=Array.from(t.parentElement.children).filter(r=>r.tagName===t.tagName);if(i.length>1){const r=i.indexOf(t)+1;n+=`:nth-of-type(${r})`}}}e.unshift(n),t=t.parentElement}return e.join(" > ")||o.tagName.toLowerCase()}function rt(o){const e=window.getComputedStyle(o),t=d=>{const u=parseFloat(d);return isNaN(u)?0:Math.round(u)},n=o.getBoundingClientRect(),a={top:t(e.paddingTop),right:t(e.paddingRight),bottom:t(e.paddingBottom),left:t(e.paddingLeft)},i={top:t(e.borderTopWidth),right:t(e.borderRightWidth),bottom:t(e.borderBottomWidth),left:t(e.borderLeftWidth)},r={top:t(e.marginTop),right:t(e.marginRight),bottom:t(e.marginBottom),left:t(e.marginLeft)},c=Math.max(0,Math.round(n.width-a.left-a.right-i.left-i.right)),s=Math.max(0,Math.round(n.height-a.top-a.bottom-i.top-i.bottom));return{margin:r,border:i,padding:a,content:{width:c,height:s}}}function at(o){const e=[];let t=o;for(;t&&t!==document.documentElement;)e.unshift({tagName:t.tagName.toLowerCase(),id:t.id||"",classList:Array.from(t.classList).filter(n=>!n.startsWith("rip-")),selector:p(t)}),t=t.parentElement;return e}function it(o){let e=o;for(;e;){const t=window.getComputedStyle(e).backgroundColor;if(t&&t!=="transparent"&&t!=="rgba(0, 0, 0, 0)")return t;e=e.parentElement}return"rgb(255, 255, 255)"}function st(o){const e=window.getComputedStyle(o),t=o.getBoundingClientRect(),n=p(o),a=rt(o),i=at(o),r=["display","position","flex-direction","justify-content","align-items","gap","grid-template-columns","grid-template-rows","width","height","max-width","min-width","margin","padding","font-family","font-size","font-weight","line-height","letter-spacing","text-align","color","background-color","border-color","border-width","border-radius","box-shadow","opacity","z-index","overflow","cursor","transition"],c={};for(const h of r)c[h]=e.getPropertyValue(h);const s={};if(o instanceof HTMLElement)for(let h=0;h<o.style.length;h++){const tt=o.style[h];s[tt]=o.style.getPropertyValue(tt)}const d=e.color,u=it(o),_=e.borderColor,y=nt(d,u);return{tagName:o.tagName.toLowerCase(),id:o.id||"",classList:Array.from(o.classList).filter(h=>!h.startsWith("rip-")),selector:n,rect:{top:Math.round(t.top+window.scrollY),left:Math.round(t.left+window.scrollX),width:Math.round(t.width),height:Math.round(t.height)},boxModel:a,computedStyles:c,inlineStyles:s,textContent:(o.textContent||"").trim().slice(0,150),parentHierarchy:i,childrenCount:o.children.length,colors:{color:d,backgroundColor:u,borderColor:_},contrast:y,isInteractive:["A","BUTTON","INPUT","SELECT","TEXTAREA"].includes(o.tagName)}}let E=!1,l=null,k=null;const b=new WeakMap,w=new WeakMap,g=new WeakMap;function D(o){if(!E)return;const t=document.elementsFromPoint(o.clientX,o.clientY).find(n=>!n.id.startsWith("rip-")&&!n.closest("#rip-inspect-hover-overlay")&&!n.closest("#rip-grid-overlay"));t&&t!==k&&t!==document.documentElement&&t!==document.body&&(k=t,et(t))}function H(o){if(!E)return;o.preventDefault(),o.stopPropagation();const t=document.elementsFromPoint(o.clientX,o.clientY).find(n=>!n.id.startsWith("rip-")&&!n.closest("#rip-inspect-hover-overlay")&&!n.closest("#rip-grid-overlay"));t&&t instanceof HTMLElement&&(z(t),S(),chrome.runtime.sendMessage({action:"ELEMENT_SELECTED",payload:st(t)}).catch(()=>{}))}function F(o){o.key==="Escape"&&E&&(S(),chrome.runtime.sendMessage({action:"STOP_PICKER"}).catch(()=>{}))}function X(){E=!0,document.addEventListener("mousemove",D,!0),document.addEventListener("click",H,!0),document.addEventListener("keydown",F,!0),document.body.style.cursor="crosshair"}function S(){E=!1,k=null,$(),document.removeEventListener("mousemove",D,!0),document.removeEventListener("click",H,!0),document.removeEventListener("keydown",F,!0),document.body.style.cursor=""}function z(o){l=o,f(o)}function q(){l=null,A()}function V(o,e,t){const n=l&&p(l)===o?l:document.querySelector(o);if(!n)return{success:!1,error:"Element not found"};b.has(n)||b.set(n,new Map);const a=b.get(n);return a.has(e)||a.set(e,n.style.getPropertyValue(e)||""),n.style.setProperty(e,t,"important"),f(n),{success:!0}}function G(o,e){const t=l&&p(l)===o?l:document.querySelector(o);if(!t)return{success:!1,error:"Element not found"};const n=b.get(t);if(n&&n.has(e)){const a=n.get(e);a?t.style.setProperty(e,a):t.style.removeProperty(e)}else t.style.removeProperty(e);return f(t),{success:!0}}function U(o){const e=l&&p(l)===o?l:document.querySelector(o);if(!e)return{success:!1,error:"Element not found"};const t=b.get(e);return t&&(t.forEach((n,a)=>{n?e.style.setProperty(a,n):e.style.removeProperty(a)}),b.delete(e)),f(e),{success:!0}}function K(o,e){const t=l&&p(l)===o?l:document.querySelector(o);return t?(w.has(t)||w.set(t,t.textContent||""),t.textContent=e,f(t),{success:!0}):{success:!1,error:"Element not found"}}function j(o){const e=l&&p(l)===o?l:document.querySelector(o);return e?(w.has(e)&&(e.textContent=w.get(e),w.delete(e)),f(e),{success:!0}):{success:!1,error:"Element not found"}}function J(o,e){const t=l&&p(l)===o?l:document.querySelector(o);return t?(t instanceof HTMLImageElement?(g.has(t)||g.set(t,t.src),t.src=e):(g.has(t)||g.set(t,t.style.backgroundImage||""),t.style.backgroundImage=`url("${e}")`),f(t),{success:!0}):{success:!1,error:"Element not found"}}function Q(o){const e=l&&p(l)===o?l:document.querySelector(o);if(!e)return{success:!1,error:"Element not found"};if(g.has(e)){const t=g.get(e);e instanceof HTMLImageElement?e.src=t:e.style.backgroundImage=t,g.delete(e)}return f(e),{success:!0}}function Z(){const o=[],e=new Set;Array.from(document.querySelectorAll("img")).forEach((r,c)=>{const s=r.currentSrc||r.src;s&&!s.startsWith("chrome-extension://")&&!e.has(s)&&(e.add(s),o.push({id:`img-${c}`,type:"image",url:s,altText:r.alt||"",dimensions:{width:r.naturalWidth||r.clientWidth,height:r.naturalHeight||r.clientHeight}}))}),Array.from(document.querySelectorAll("svg")).forEach((r,c)=>{if(r.closest("#rip-svg-filters")||r.closest("#rip-inspect-hover-overlay"))return;const s=r.getBoundingClientRect(),u=new XMLSerializer().serializeToString(r);o.push({id:`svg-${c}`,type:"svg",url:`data:image/svg+xml;utf8,${encodeURIComponent(u)}`,altText:r.getAttribute("aria-label")||r.getAttribute("name")||`SVG Icon #${c+1}`,dimensions:{width:Math.round(s.width)||24,height:Math.round(s.height)||24},isInlineSvg:!0,svgContent:u})});const a=Array.from(document.querySelectorAll("*"));let i=0;for(const r of a){if(r.id.startsWith("rip-"))continue;const s=window.getComputedStyle(r).backgroundImage;if(s&&s!=="none"&&s.startsWith("url(")){const d=s.match(/url\(['"]?(.*?)['"]?\)/);if(d&&d[1]&&!e.has(d[1])){e.add(d[1]);const u=r.getBoundingClientRect();o.push({id:`bg-${i++}`,type:"background-image",url:d[1],altText:`Background on <${r.tagName.toLowerCase()}>`,dimensions:{width:Math.round(u.width),height:Math.round(u.height)}})}}}return o.slice(0,100)}chrome.runtime.onMessage.addListener((o,e,t)=>{switch(o.action){case"PING":t({success:!0});break;case"START_PICKER":X(),t({success:!0});break;case"STOP_PICKER":S(),t({success:!0});break;case"CLEAR_SELECTION":q(),t({success:!0});break;case"APPLY_CSS":{const n=o.payload,a=V(n.selector,n.property,n.value);t(a);break}case"REMOVE_CSS":{const n=o.payload,a=G(n.selector,n.property);t(a);break}case"RESET_ELEMENT_CSS":{const n=o.payload,a=U(n.selector);t(a);break}case"UPDATE_TEXT":{const n=o.payload,a=K(n.selector,n.text);t(a);break}case"RESET_TEXT":{const n=o.payload,a=j(n.selector);t(a);break}case"UPDATE_IMAGE":{const n=o.payload,a=J(n.selector,n.src);t(a);break}case"RESET_IMAGE":{const n=o.payload,a=Q(n.selector);t(a);break}case"SET_XRAY":{const n=o.payload;P(n.enabled),t({success:!0});break}case"SET_GRID":{const n=o.payload;B(n.enabled,n.config),t({success:!0});break}case"SET_DARK_THEME":{const n=o.payload;N(n.mode),t({success:!0});break}case"SET_COLOR_BLINDNESS":{const n=o.payload;O(n.type),t({success:!0});break}case"DISCOVER_ASSETS":{const n=Z();t({success:!0,data:n});break}case"SYNC_SCROLL":{const n=o.payload;window.scrollTo({left:n.scrollX,top:n.scrollY,behavior:"auto"}),t({success:!0});break}case"SYNC_SCROLL_DELTA":{const n=o.payload;window.scrollBy({top:n.deltaY,behavior:"auto"}),t({success:!0});break}case"GET_PAGE_INFO":{t({success:!0,data:{title:document.title,url:window.location.href,viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio}}});break}default:t({success:!1,error:"Unknown action"})}return!0}),window.addEventListener("message",o=>{if(o.data){if(o.data.action==="SYNC_SCROLL_DELTA")window.scrollBy({top:o.data.deltaY||0,behavior:"auto"});else if(o.data.action==="SYNC_SCROLL_PERCENT"){const e=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);window.scrollTo({top:(o.data.percent||0)*e,behavior:"auto"})}}}),window.addEventListener("beforeunload",()=>{ot()}),m.applyCss=V,m.clearSelection=q,m.discoverPageAssets=Z,m.removeCss=G,m.resetElementCss=U,m.resetImage=Q,m.resetText=j,m.selectTargetElement=z,m.startPicker=X,m.stopPicker=S,m.updateImage=J,m.updateText=K,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})})(this.ResponsiveInspectorContent=this.ResponsiveInspectorContent||{});
