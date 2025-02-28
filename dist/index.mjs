const e=(e,t)=>{const r=[];for(let n=0;n<t.length;n+=e)r.push(t.slice(n,n+e));return r},t=(e,t,r)=>e>t?e<r?e:r:t,r=(e,t)=>t[e%10==1&&e%100!=11?0:e%10>=2&&e%10<=4&&(e%100<10||e%100>=20)?1:2];function n(e,t){return e<=0?t:e+(t-e%t)%t}const o=(e,t,r=1)=>{const n=t||["","k","M","G","T","P"],o=e<0,a=Math.abs(e),s=Math.log10(a)/3|0,c=a/10**(3*s);return parseFloat(`${o?"-":""}${c%1?(Math.floor(10*c)/10).toFixed(r):c}`)+n[s]},a=e=>{if(!e)return"только что";const t=new Date(e),n=Math.floor((Date.now()-t.getTime())/1e3),o=()=>new Intl.DateTimeFormat("RU-ru",{day:"numeric",month:"short"}).format(t).replace(".",""),a=()=>t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),s=(e,t,n)=>Array.isArray(e)?`${n} ${r(n,e)} ${t}`:`${e} ${t}`;switch(!0){case n<0:return"скоро";case n<60:return s(["секунду","секунды","секунд"],"назад",n);case n<3600:return s(["минуту","минуты","минут"],"назад",Math.floor(n/60));case n<7200:return s("час","назад",Math.floor(n/3600));case n<10800:return s("два часа","назад",Math.floor(n/3600));case n<14400:return s("три часа","назад",Math.floor(n/3600));case n<86400:return s(`сегодня в ${a()}`,"",Math.floor(n/3600));case n<172800:return s(`вчера в ${a()}`,"",Math.floor(n/86400));case n<259200:return s("два дня","назад",Math.floor(n/86400));case n<345600:return s("три дня","назад",Math.floor(n/86400));case n<31536e3:return s(`${o()} в ${a()}`,"",Math.floor(n/86400));case n>=31536e3:return s(`${o()} ${t.getFullYear()} г.`,"",Math.floor(n/31536e3))}return"только что"},s=e=>(e||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."),c=e=>{for(let t=e.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}return e},u=(e,t)=>Math.floor(Math.random()*(t-e+1)+e),i={date:e=>e instanceof Date,regexp:e=>e instanceof RegExp,error:e=>e instanceof Error,map:e=>e instanceof Map,set:e=>e instanceof Set,weakmap:e=>e instanceof WeakMap,weakset:e=>e instanceof WeakSet,promise:e=>e instanceof Promise,buffer:e=>e instanceof Buffer,undefined:e=>void 0===e,string:e=>"string"==typeof e,bigint:e=>"bigint"==typeof e,number:e=>"number"==typeof e&&!isNaN(e),nan:e=>"number"==typeof e&&isNaN(e),boolean:e=>"boolean"==typeof e,array:e=>Array.isArray(e),object:e=>"object"==typeof e&&!Array.isArray(e)&&null!==e,function:e=>"function"==typeof e,null:e=>null===e,symbol:e=>"symbol"==typeof e,unknown:()=>!0};function l(e,t){for(const[r,n]of Object.entries(i))if(n(e))return void 0!==t?r===t:r;return void 0===t&&"unknown"}function f(e,t){return Object.keys(e).reduce(((r,n)=>(t.includes(n)||(r[n]=e[n]),r)),{})}function b(e,t){return Object.keys(e).reduce(((r,n)=>(t.includes(n)&&(r[n]=e[n]),r)),{})}const g=async e=>await new Promise((t=>setTimeout(t,e))),p=e=>{if(!e)return!1;try{return navigator.clipboard?.writeText(e),!0}catch{}try{var t=document.createElement("input");return t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),!0}catch{}return!1},h=(e,t)=>{const r=[],n=/{{([^}]+):([^}]+)}}/g;let o,a=0;for(;null!==(o=n.exec(e));)r.push(e.substring(a,o.index)),a=o.index+o[0].length,r.push({key:o[1],text:o[2]});return r.push(e.substring(a)),r.map((e=>"string"==typeof e?e:t(e.key,e.text)))},m=(e,t)=>{if(e===t)return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return e===t;if("[object Map]"===Object.prototype.toString.call(e)&&"[object Map]"===Object.prototype.toString.call(t))return y(e,t);const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!1;for(let n of r){if(!t.hasOwnProperty(n))return!1;const r=e[n],o=t[n];if(Array.isArray(r)&&Array.isArray(o)){if(r.length!==o.length)return!1;for(let e=0;e<r.length;e++)if(!m(r[e],o[e]))return!1}else if(!m(r,o))return!1}return!0},y=(e,t)=>{if(e.size!==t.size)return!1;for(const[r,n]of e){if(!t.has(r))return!1;if(!m(t.get(r),n))return!1}return!0},d=e=>{const t=e=>{if("string"==typeof e||"number"==typeof e||"boolean"==typeof e||null===e)return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(t).join(",")+"]";if("object"==typeof e){const r=Object.keys(e).sort();let n="{";for(let o=0;o<r.length;o++){const a=r[o];n+=JSON.stringify(a)+":"+t(e[a]),o<r.length-1&&(n+=",")}return n+="}",n}return String(e)},r=e=>{let t=0;if(0===e.length)return t;for(let r=0;r<e.length;r++){t=(t<<5)-t+e.charCodeAt(r),t|=0}return t};try{const n=t(e);return r(n).toString(16)}catch(t){return console.warn(`Object could not be fully stringified. Using a simple string conversion. Error: ${t}`),r(String(e)).toString(16)}},k=e=>Object.prototype.toString.call(e),j=(e,t)=>{switch(t||k(t)){case"[object Number]":return Number(String(e));case"[object String]":return String(e);case"[object BigInt]":return BigInt(String(e));case"[object Map]":return new Map(e);case"[object Set]":return new Set(e);default:return e}},w=e=>{const t=[];for(const r of e){const e=k(r);"[object Array]"===e?t.push(w(r)):"[object Object]"===e?t.push(v(r)):t.push(j(r))}return t},v=e=>{const t={},r=Object.keys(e);for(const n of r){const r=k(e[n]);t[n]="[object Array]"===r?w(e[n]):"[object Object]"===r?v(e[n]):e[n]}return t},M=e=>{switch(k(e)){case"[object Array]":return w(e);case"[object Object]":return v(e);default:return j(e)}},z=new RegExp(/(?:https?:\/\/)?(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)/),A=new RegExp(/(?:https?:\/\/)(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)/),x=e=>e,S=(e,t)=>{const r=t?.onToken??x,n=t?.requireProtocol??!1,o=t?.regex??n?A:z,a=[];let s=e,c=o.exec(s);for(;c;){const e=c[0],t=c.index;t>0&&(a.push(r({type:"raw",value:s.substring(0,t)})),s=s.substring(t)),a.push(r({type:"url",value:e})),s=s.substring(e.length),c=o.exec(s)}return s.length>0&&a.push(r({type:"raw",value:s})),a},O=(e,t,r)=>{var n,o,a,s,c,u,i,l;switch(u=r*(1-t),i=r*(1-(c=6*e-(s=Math.floor(6*e)))*t),l=r*(1-(1-c)*t),s%6){case 0:n=r,o=l,a=u;break;case 1:n=i,o=r,a=u;break;case 2:n=u,o=r,a=l;break;case 3:n=u,o=i,a=r;break;case 4:n=l,o=u,a=r;break;case 5:n=r,o=u,a=i}return[Math.round(255*n),Math.round(255*o),Math.round(255*a)]},$=e=>{const t=e.toString(16);return 1==t.length?"0"+t:t},N=(e,t,r)=>"#"+$(e)+$(t)+$(r),T=(e,t,r)=>{var n=Math.max(e,t,r),o=Math.min(e,t,r),a=n-o,s=0,c=0===n?0:a/n,u=n/255;switch(n){case o:s=0;break;case e:s=t-r+a*(t<r?6:0),s/=6*a;break;case t:s=r-e+2*a,s/=6*a;break;case r:s=e-t+4*a,s/=6*a}return[s,c,u]},q=e=>{if(3===(e=e.replace("#","")).length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)return[0,0,0];const t=parseInt(e.substring(0,2),16),r=parseInt(e.substring(2,4),16),n=parseInt(e.substring(4,6),16);return isNaN(t)||isNaN(r)||isNaN(n)||t<0||t>255||r<0||r>255||n<0||n>255?[0,0,0]:[t,r,n]};export{q as HEXtoRGB,O as HSVtoRGB,N as RGBtoHEX,T as RGBtoHSV,n as alignTo,e as chunks,t as clamp,m as comparison,p as copyText,h as createLinksFromText,r as decWord,s as formatNumber,d as generateUniqueKey,l as isType,f as omit,b as pick,u as random,c as shuffle,g as sleep,S as textParserUrl,a as timeAgo,o as toShort,M as unlink};
