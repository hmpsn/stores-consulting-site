import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import ts from 'typescript';
const analytics=ts.transpileModule(fs.readFileSync('src/scripts/analytics.ts','utf8').replaceAll('export ',''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
test.beforeEach(async ({},info)=>{test.skip(info.project.name!=='chromium-1440','Single integration viewport');});
test('analytics tracks intended events without sending form data or query strings',async({page})=>{
 await page.route('https://www.googletagmanager.com/**',route=>route.abort());
 await page.route('https://storesconsulting.com/**',route=>route.fulfill({contentType:'text/html',body:'<title>Test page</title><a href="mailto:private@example.com">Email</a><a href="/report.pdf?secret=x">Report</a>'}));
 await page.goto('https://storesconsulting.com/article/?email=private@example.com');
 await page.addScriptTag({content:analytics});
 await page.evaluate(()=>document.addEventListener('click',event=>event.preventDefault()));
 await page.getByRole('link',{name:'Email'}).click();
 await page.getByRole('link',{name:'Report'}).click();
 await page.evaluate(()=>document.dispatchEvent(new Event('stores:inquiry-success')));
 const events=await page.evaluate(()=>Array.from((window as any).dataLayer,(x:any)=>Array.from(x)));
 expect(JSON.stringify(events)).not.toContain('private@example.com');
 expect(events.filter((e:any)=>e[1]==='page_view')).toHaveLength(1);
 expect(events.some((e:any)=>e[1]==='contact_click')).toBe(true);
 expect(events.some((e:any)=>e[1]==='generate_lead')).toBe(true);
 expect(events.some((e:any)=>e[1]==='report_download' && e[2].file_name==='report.pdf')).toBe(true);
 expect(JSON.stringify(events)).not.toContain('secret=');
});
test('analytics excludes local previews and embedded editor sessions',async({page})=>{
 await page.goto('/');await page.addScriptTag({content:analytics});
 expect(await page.evaluate(()=>(window as any).dataLayer)).toBeUndefined();
 await page.route('https://storesconsulting.com/**',route=>route.fulfill({contentType:'text/html',body:'<iframe srcdoc="<p>Editor preview</p>"></iframe>'}));
 await page.goto('https://storesconsulting.com/');
 const frame=page.frames().find(f=>f.parentFrame());
 await frame!.addScriptTag({content:analytics});
 expect(await frame!.evaluate(()=>(window as any).dataLayer)).toBeUndefined();
});
test('services and report link to relevant content and contact',async({page})=>{
 await page.goto('/services/shrink-profit-recovery/');
 await expect(page.getByRole('link',{name:'Improving Loss Prevention Strategies',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Improving Loss Prevention Strategies',exact:true}).click();
 await expect(page.getByRole('heading',{name:'How we can help'})).toBeVisible();
 await expect(page.locator('main a[href="/services/shrink-profit-recovery/"]')).toBeVisible();
 await expect(page.locator('main a[href="/contact-us/"]').last()).toBeVisible();
});
test('only a delivered inquiry emits the lead event',async({page})=>{
 await page.goto('/contact-us/');
 await page.evaluate(()=>{(window as any).leadEvents=0;document.addEventListener('stores:inquiry-success',()=>{(window as any).leadEvents++;});});
 let code='success';await page.route('**/api/contact',route=>route.fulfill({status:code==='rate_limited'?429:200,json:{ok:code!=='rate_limited',code}}));
 for(const value of ['rate_limited','success','delivered']){code=value;await page.locator('#name').fill('Test');await page.locator('#email').fill('test@example.com');await page.locator('#message').fill('Local mocked test');await page.getByRole('button',{name:'Send Message',exact:false}).click();await expect(page.locator('[data-form-feedback]')).toContainText(value==='rate_limited'?'Too many attempts':'Thank');}
 expect(await page.evaluate(()=>(window as any).leadEvents)).toBe(1);
});
test('Tina opens existing posts at public routes and shows named pickers',async({page})=>{
 // Public-page tests cover remote media; editor registration should not wait on it.
 await page.route('https://**/*',route=>route.abort());
 await page.goto('/admin/index.html#/collections/post/~');
 const enter=page.getByRole('button',{name:'Enter Edit Mode'});
 await enter.click();
 await page.getByText('Big Data, Big Deal',{exact:true}).click();
 await expect(page.locator('#tina-iframe')).toHaveAttribute('src','/big-data-big-deal/');
 await expect(page.frameLocator('#tina-iframe').locator('main')).toBeVisible();
 await page.waitForLoadState('networkidle');
 await expect(page.getByLabel('Author',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Author',{exact:true}).locator('option')).toContainText(['admin','Eileen Collie','Rochelle Romeo','Scott Dresen']);
});
