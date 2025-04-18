"use strict";const t=(t,e)=>e[t%10==1&&t%100!=11?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2];function e(t,e,r){if(!r){const t=new Date;r=t.getDate()*t.getFullYear()*(t.getHours()??1)*t.getMilliseconds()}const n=function(t){const e=2**32;let r=t;return function(){var t;return r=(1664525*r+1013904223)%e,t=r,t^=t>>>21,r=(t^=t<<35)^t>>>4,(r>>>0)/e}}(r);return function(t,e,r){if(e>r)throw new Error("Минимальная граница не может быть больше максимальной.");return Math.floor(t()*(r-e+1))+e}(n,t,e)}const r={date:t=>t instanceof Date,regexp:t=>t instanceof RegExp,error:t=>t instanceof Error,map:t=>t instanceof Map,set:t=>t instanceof Set,weakmap:t=>t instanceof WeakMap,weakset:t=>t instanceof WeakSet,promise:t=>t instanceof Promise,buffer:t=>t instanceof Buffer,undefined:t=>void 0===t,string:t=>"string"==typeof t,bigint:t=>"bigint"==typeof t,number:t=>"number"==typeof t&&!isNaN(t),nan:t=>"number"==typeof t&&isNaN(t),boolean:t=>"boolean"==typeof t,array:t=>Array.isArray(t),object:t=>"object"==typeof t&&!Array.isArray(t)&&null!==t,function:t=>"function"==typeof t,null:t=>null===t,symbol:t=>"symbol"==typeof t,unknown:()=>!0};const n=(t,e)=>{if(t===e)return!0;if("object"!=typeof t||null===t||"object"!=typeof e||null===e)return t===e;if("[object Map]"===Object.prototype.toString.call(t)&&"[object Map]"===Object.prototype.toString.call(e))return o(t,e);const r=Object.keys(t);if(r.length!==Object.keys(e).length)return!1;for(let o of r){if(!e.hasOwnProperty(o))return!1;const r=t[o],s=e[o];if(Array.isArray(r)&&Array.isArray(s)){if(r.length!==s.length)return!1;for(let t=0;t<r.length;t++)if(!n(r[t],s[t]))return!1}else if(!n(r,s))return!1}return!0},o=(t,e)=>{if(t.size!==e.size)return!1;for(const[r,o]of t){if(!e.has(r))return!1;if(!n(e.get(r),o))return!1}return!0},s=t=>Object.prototype.toString.call(t),c=(t,e)=>{switch(e||s(e)){case"[object Number]":return Number(String(t));case"[object String]":return String(t);case"[object BigInt]":return BigInt(String(t));case"[object Map]":return new Map(t);case"[object Set]":return new Set(t);default:return t}},a=t=>{const e=[];for(const r of t){const t=s(r);"[object Array]"===t?e.push(a(r)):"[object Object]"===t?e.push(i(r)):e.push(c(r))}return e},i=t=>{const e={},r=Object.keys(t);for(const n of r){const r=s(t[n]);e[n]="[object Array]"===r?a(t[n]):"[object Object]"===r?i(t[n]):t[n]}return e},u=new RegExp(/(?:https?:\/\/)?(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)(?:\s)/),f=new RegExp(/(?:https?:\/\/)(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)(?:\s)/),l=t=>t;function p(t,e){return e.split(".").reduce(((t,e)=>t?t[e]:void 0),t)}const g=t=>{const e=t.toString(16);return 1==e.length?"0"+e:e};exports.HEXtoRGB=t=>{if(3===(t=t.replace("#","")).length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),6!==t.length)return[0,0,0];const e=parseInt(t.substring(0,2),16),r=parseInt(t.substring(2,4),16),n=parseInt(t.substring(4,6),16);return isNaN(e)||isNaN(r)||isNaN(n)||e<0||e>255||r<0||r>255||n<0||n>255?[0,0,0]:[e,r,n]},exports.HSVtoRGB=(t,e,r)=>{var n,o,s,c,a,i,u,f;switch(i=r*(1-e),u=r*(1-(a=6*t-(c=Math.floor(6*t)))*e),f=r*(1-(1-a)*e),c%6){case 0:n=r,o=f,s=i;break;case 1:n=u,o=r,s=i;break;case 2:n=i,o=r,s=f;break;case 3:n=i,o=u,s=r;break;case 4:n=f,o=i,s=r;break;case 5:n=r,o=i,s=u}return[Math.round(255*n),Math.round(255*o),Math.round(255*s)]},exports.RGBtoHEX=(t,e,r)=>"#"+g(t)+g(e)+g(r),exports.RGBtoHSV=(t,e,r)=>{var n=Math.max(t,e,r),o=Math.min(t,e,r),s=n-o,c=0,a=0===n?0:s/n,i=n/255;switch(n){case o:c=0;break;case t:c=e-r+s*(e<r?6:0),c/=6*s;break;case e:c=r-t+2*s,c/=6*s;break;case r:c=t-e+4*s,c/=6*s}return[c,a,i]},exports.alignTo=function(t,e){return t<=0?e:t+(e-t%e)%e},exports.chunks=(t,e)=>{const r=[];for(let n=0;n<e.length;n+=t)r.push(e.slice(n,n+t));return r},exports.clamp=(t,e,r)=>t>e?t<r?t:r:e,exports.comparison=n,exports.copyText=t=>{if(!t)return!1;try{return navigator.clipboard?.writeText(t),!0}catch{}try{var e=document.createElement("input");return e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e),!0}catch{}return!1},exports.createLinksFromText=(t,e)=>{const r=[],n=/{{([^}]+):([^}]+)}}/g;let o,s=0;for(;null!==(o=n.exec(t));)r.push(t.substring(s,o.index)),s=o.index+o[0].length,r.push({key:o[1],text:o[2]});return r.push(t.substring(s)),r.map((t=>"string"==typeof t?t:e(t.key,t.text)))},exports.decWord=t,exports.formatNumber=t=>(t||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."),exports.generateUniqueKey=t=>{const e=t=>{if("string"==typeof t||"number"==typeof t||"boolean"==typeof t||null===t)return JSON.stringify(t);if(Array.isArray(t))return"["+t.map(e).join(",")+"]";if("object"==typeof t){const r=Object.keys(t).sort();let n="{";for(let o=0;o<r.length;o++){const s=r[o];n+=JSON.stringify(s)+":"+e(t[s]),o<r.length-1&&(n+=",")}return n+="}",n}return String(t)},r=t=>{let e=0;if(0===t.length)return e;for(let r=0;r<t.length;r++){e=(e<<5)-e+t.charCodeAt(r),e|=0}return e};try{const n=e(t);return r(n).toString(16)}catch(e){return console.warn(`Object could not be fully stringified. Using a simple string conversion. Error: ${e}`),r(String(t)).toString(16)}},exports.groupBy=function(t,e){return t.reduce(((t,r)=>{const n=e(r);return t[n]||(t[n]=[]),t[n].push(r),t}),{})},exports.isType=function(t,e){for(const[n,o]of Object.entries(r))if(o(t))return void 0!==e?n===e:n;return void 0===e&&"unknown"},exports.memoize=function(t){const e=new Map;return function(...r){const n=JSON.stringify(r);if(e.has(n))return e.get(n);const o=t(...r);return e.set(n,o),o}},exports.omit=function(t,e){return Object.keys(t).reduce(((r,n)=>(e.includes(n)||(r[n]=t[n]),r)),{})},exports.orderBy=function(t,e){const r=Object.keys(e);return t.slice().sort(((t,n)=>{for(const o of r){const r="desc"===e[o]?-1:1,s=p(t,o),c=p(n,o);if(s<c)return-r;if(s>c)return r}return 0}))},exports.parseQueryString=function(t){const e={},r=(t.startsWith("?")?t.slice(1):t).split("&");for(const t of r){const[r,n]=t.split("=");if(r){const t=decodeURIComponent(r),o=n?decodeURIComponent(n):"";e[t]=o}}return e},exports.pick=function(t,e){return Object.keys(t).reduce(((r,n)=>(e.includes(n)&&(r[n]=t[n]),r)),{})},exports.random=e,exports.randomByWeight=function(t,r){let n=0;for(const e in t)n+=t[e];const o=e(0,n,r);let s=0;for(const e in t)if(s+=t[e],o<s)return e;const c=Object.keys(t);return c[e(0,c.length-1,r)]},exports.retry=function(t,e,r){return new Promise(((n,o)=>{const s=e=>{t().then(n).catch((t=>{0===e?o(t):(console.log(`Retrying... attempts left: ${e}`),setTimeout((()=>s(e-1)),r))}))};s(e)}))},exports.shuffle=(t,r)=>{for(let n=t.length-1;n>0;n--){const o=e(0,n,r);[t[n],t[o]]=[t[o],t[n]]}return t},exports.sleep=async t=>await new Promise((e=>setTimeout(e,t))),exports.textParserUrl=(t,e)=>{const r=e?.onToken??l,n=e?.requireProtocol??!1,o=e?.regex??n?f:u,s=[];let c=t+" ",a=o.exec(c);for(;a;){const t=a[0].trim(),e=a.index;e>0&&(s.push(r({type:"raw",value:c.substring(0,e)})),c=c.substring(e)),s.push(r({type:"url",value:t})),c=c.substring(t.length),a=o.exec(c)}return c.length>0&&s.push(r({type:"raw",value:c})),s},exports.timeAgo=e=>{if(!e)return"только что";const r=new Date(e),n=Math.floor((Date.now()-r.getTime())/1e3),o=()=>new Intl.DateTimeFormat("RU-ru",{day:"numeric",month:"short"}).format(r).replace(".",""),s=()=>r.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),c=(e,r,n)=>Array.isArray(e)?`${n} ${t(n,e)} ${r}`:`${e} ${r}`;switch(!0){case n<0:return"скоро";case n<60:return c(["секунду","секунды","секунд"],"назад",n);case n<3600:return c(["минуту","минуты","минут"],"назад",Math.floor(n/60));case n<7200:return c("час","назад",Math.floor(n/3600));case n<10800:return c("два часа","назад",Math.floor(n/3600));case n<14400:return c("три часа","назад",Math.floor(n/3600));case n<86400:return c(`сегодня в ${s()}`,"",Math.floor(n/3600));case n<172800:return c(`вчера в ${s()}`,"",Math.floor(n/86400));case n<259200:return c("два дня","назад",Math.floor(n/86400));case n<345600:return c("три дня","назад",Math.floor(n/86400));case n<31536e3:return c(`${o()} в ${s()}`,"",Math.floor(n/86400));case n>=31536e3:return c(`${o()} ${r.getFullYear()} г.`,"",Math.floor(n/31536e3))}return"только что"},exports.toShort=(t,e,r=1)=>{const n=e||["","k","M","G","T","P"],o=t<0,s=Math.abs(t),c=Math.log10(s)/3|0,a=s/10**(3*c);return parseFloat(`${o?"-":""}${a%1?(Math.floor(10*a)/10).toFixed(r):a}`)+n[c]},exports.unique=function(t){return Array.from(new Set(t))},exports.unlink=t=>{switch(s(t)){case"[object Array]":return a(t);case"[object Object]":return i(t);default:return c(t)}};
