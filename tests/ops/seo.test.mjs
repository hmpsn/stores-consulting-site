import {test} from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import fs from 'node:fs';
import {buildStructuredData,serializeJsonLd} from '../../src/lib/structured-data.ts';
const base={origin:'https://example.com',path:'/article/',title:'Title',description:'Summary',image:'/image.png',organization:'Company',email:'contact@example.com',business:{description:'Consulting',logo:'/logo.png',sameAs:[]}};
test('structured data links the actual publisher, author, canonical and breadcrumbs',()=>{
 const graph=buildStructuredData({...base,kind:'article',record:{publishedDate:'2026-09-10T12:00:00Z',updatedDate:'2026-09-10T13:00:00Z'},author:{name:'Writer',route:'/author/writer/'},breadcrumbs:[{name:'Home',path:'/'},{name:'Blog',path:'/blog/'},{name:'Title',path:'/article/'}]})['@graph'];
 const article=graph.find(x=>x['@type']==='BlogPosting');
 assert.equal(article.author.url,'https://example.com/author/writer/');
 assert.equal(article.publisher['@id'],'https://example.com/#organization');
 assert.equal(article.datePublished,'2026-09-10T12:00:00.000Z');
 assert.equal(graph.find(x=>x['@type']==='BreadcrumbList').itemListElement[2].item,'https://example.com/article/');
 assert.equal(graph.find(x=>x['@type']==='Organization').sameAs,undefined);
 assert(!buildStructuredData({...base,kind:'article',record:{draft:true}})['@graph'].some(x=>x['@type']==='BlogPosting'));
 const service=buildStructuredData({...base,kind:'service',record:{title:'Service',summary:'Actual service'}})['@graph'].at(-1);
 assert.equal(service.provider['@id'],'https://example.com/#organization');
});
test('JSON-LD serialization cannot break out into executable HTML',()=>{
 const data={name:'</script><script>alert(1)</script>\u2028&'};
 const json=serializeJsonLd(data);assert(!json.includes('<'));assert.deepEqual(JSON.parse(json),data);
});
test('browser icons remain opaque white in every raster size and SVG has no dark-mode inversion',async()=>{
 for(const name of ['favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png']){
  const {data,info}=await sharp('public/assets/brand/'+name).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual([...data.subarray(0,4)],[255,255,255,255]);
  for(let i=3;i<data.length;i+=info.channels)assert.equal(data[i],255);
 }
 const svg=fs.readFileSync('public/favicon.svg','utf8');assert(svg.includes('fill="#ffffff"'));assert(!svg.includes('prefers-color-scheme'));
 const ico=fs.readFileSync('public/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt32LE(18),22);
});
