import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const groups = ['posts','clients','people','authors','categories','legacy-pages'];
const documents = {};
for (const group of groups) {
 documents[group] = await Promise.all((await readdir(`src/content/${group}`)).filter(f=>/\.(md|yaml)$/.test(f)).map(async file=>{
  const raw=await readFile(`src/content/${group}/${file}`,'utf8');
  return {file,data:parse(file.endsWith('.md')?raw.split(/^---\s*$/m)[1]:raw)};
 }));
}
const errors=[];
const routes=new Map();
const explicit=new Set(['/','/about/','/approach/','/results/','/clients/','/services/','/contact-us/','/tscg-blog/','/styleguide/','/404/','/admin/','/feed/','/robots.txt','/api/contact']);
for(const file of await readdir('src/content/services')) { const data = parse(await readFile('src/content/services/'+file,'utf8')); explicit.add(`/services/${data.slug}/`); }
for(const group of ['posts','clients','authors','categories','legacy-pages'])for(const {file,data} of documents[group]) {
 if(group==='legacy-pages'&&explicit.has(data.route))continue;
 if(group==='posts'&&data.draft)continue;
 if(routes.has(data.route)) errors.push(`Duplicate public route ${data.route}: ${routes.get(data.route)} and ${file}`);
 if(group!=='legacy-pages'&&explicit.has(data.route))errors.push(`${file} overwrites a primary page`);
 routes.set(data.route,file);
}
const authors=new Set(documents.authors.map(d=>d.data.slug));
const categories=new Set(documents.categories.map(d=>d.data.slug));
for(const {file,data} of documents.posts){
 if(!authors.has(data.author))errors.push(`${file}: unknown author ${data.author}`);
 for(const category of data.categories||[])if(!categories.has(category))errors.push(`${file}: unknown category ${category}`);
 if(data.featuredMedia?.startsWith('/assets/editorial/')&&(!data.featuredAlt||!data.featuredWidth||!data.featuredHeight))errors.push(`${file}: new featured images require alternative text, width and height`);
}
for(const {file,data} of documents.clients)if(data.logo?.startsWith('/assets/editorial/')&&(!data.logoWidth||!data.logoHeight))errors.push(`${file}: new logos require width and height`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Validated editorial routes, taxonomy references and managed-image metadata (${routes.size} public records).`);
