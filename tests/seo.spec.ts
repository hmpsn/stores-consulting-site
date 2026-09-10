import {test,expect} from '@playwright/test';
test('public SEO graph, social metadata and browser assets',async({page,request},info)=>{
 test.skip(info.project.name!=='chromium-1440','One metadata check covers identical server HTML across viewports.');
 for(const [path,type] of [['/','Organization'],['/services/shrink-profit-recovery/','Service'],['/big-data-big-deal/','BlogPosting'],['/improving-loss-prevention-strategies/','DigitalDocument']]){
  await page.goto(path);
  const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()||'{}')['@graph'];
  expect(graph.some((item:any)=>item['@type']===type)).toBe(true);
  expect(graph.find((item:any)=>item['@type']==='WebPage').url).toBe('https://storesconsulting.com'+path);
  if(path!=='/')expect(graph.find((item:any)=>item['@type']==='BreadcrumbList').itemListElement.at(-1).item).toBe('https://storesconsulting.com'+path);
  const image=await page.locator('meta[property="og:image"]').getAttribute('content');expect(image).toMatch(/^https:\/\//);
  expect(await page.locator('meta[name="twitter:image"]').getAttribute('content')).toBe(image);
 }
 for(const path of ['/styleguide/','/404/']){await page.goto(path);await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);}
 await page.goto('/');await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href',/white-20260910/);
 const manifest=await request.get('/site.webmanifest');expect(manifest.ok()).toBe(true);
 const data=await manifest.json();expect(data.background_color).toBe('#ffffff');
 for(const icon of data.icons)expect((await request.get(icon.src)).ok()).toBe(true);
});
