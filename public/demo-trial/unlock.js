export function rewriteModule(source, filename) {
  return source.replace(/((?:from\s+|import\s*\()\s*["'])(\.[^"']+)(["'])/g,
    (_all, start, relative, end) => {
      const resolved = new URL(relative, 'https://demo.invalid/' + filename).pathname.slice(1);
      return start + 'pp-demo/' + resolved + end;
    });
}
export async function decryptBundle(payload, password) {
  const bytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', hash:'SHA-256', salt:bytes(payload.salt), iterations:payload.iterations}, material, {name:'AES-GCM', length:256}, false, ['decrypt']);
  const clear = await crypto.subtle.decrypt({name:'AES-GCM', iv:bytes(payload.iv)}, key, bytes(payload.data));
  return JSON.parse(new TextDecoder().decode(clear));
}
export function mountBundle(files, frame) {
  const urls = [], imports = {};
  const blob = (text, type) => { const u = URL.createObjectURL(new Blob([text], {type})); urls.push(u); return u; };
  for (const [name, text] of Object.entries(files))
    if (name.endsWith('.js')) imports['pp-demo/' + name] = blob(rewriteModule(text, name), 'text/javascript');
  const css = blob(files['src/style.css'], 'text/css');
  const map = JSON.stringify({imports}).replaceAll('<','\\u003c');
  frame.srcdoc = files['index.html']
    .replace('href="./src/style.css"', `href="${css}"`)
    .replace('<script type="module" src="./src/app.js"></script>', `<script type="importmap">${map}</script><script type="module">import "pp-demo/src/app.js";</script>`);
  return () => { frame.srcdoc = ''; urls.forEach(u => URL.revokeObjectURL(u)); };
}
