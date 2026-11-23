import {decryptBundle, mountBundle} from './unlock.js';
const dialog = document.querySelector('#unlock-dialog');
const form = document.querySelector('#unlock-form');
const input = document.querySelector('#password');
const error = document.querySelector('#error');
const launch = document.querySelector('#launch');
const frame = document.querySelector('#workbench');
let cleanup;
let attempt = 0;
launch.onclick = () => { error.textContent = ''; dialog.showModal(); input.focus(); };
document.querySelector('#cancel').onclick = () => dialog.close();
dialog.addEventListener('close', () => { attempt++; input.value = ''; launch.focus(); });
form.onsubmit = async e => {
  e.preventDefault();
  const currentAttempt = ++attempt;
  const button = form.querySelector('button[type=submit]');
  button.disabled = true; error.textContent = '正在解锁…';
  try {
    if (!crypto.subtle) throw new Error('请通过 HTTPS 打开此页面');
    const response = await fetch('./workbench.enc.json', {cache:'no-store'});
    if (!response.ok) throw new Error('演示文件暂时无法加载，请稍后重试');
    const payload = await response.json();
    let files;
    try { files = await decryptBundle(payload, input.value); }
    catch { throw new Error('密码不正确或演示文件损坏，请检查后重试'); }
    if (currentAttempt !== attempt || !dialog.open) return;
    cleanup = mountBundle(files, frame);
    dialog.close();
    document.querySelector('#welcome').hidden = true;
    document.querySelector('#demo-view').hidden = false;
    frame.focus();
  } catch(e) {
    if (currentAttempt !== attempt || !dialog.open) return;
    error.textContent = e.message;
    input.focus(); input.select();
  } finally { button.disabled = false; }
};
document.querySelector('#lock').onclick = () => {
  cleanup?.(); cleanup = null;
  document.querySelector('#demo-view').hidden = true;
  document.querySelector('#welcome').hidden = false;
  launch.focus();
};
// Direct links show the same unlock dialog; reopening or refreshing always locks.
launch.click();
