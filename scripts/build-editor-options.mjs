import {readdir,readFile,writeFile} from 'node:fs/promises';
import {parse} from 'yaml';
async function records(group) {
 return Promise.all((await readdir(`src/content/${group}`)).filter(f=>/\.(md|yaml)$/.test(f)).sort().map(async f=>{const raw=await readFile(`src/content/${group}/${f}`,'utf8');return parse(f.endsWith('.md')?raw.split(/^---\s*$/m)[1]:raw);}));
}
const [authors,categories,services,posts,clients]=await Promise.all(['authors','categories','services','posts','clients'].map(records));
const options=items=>items.sort((a,b)=>a.label.localeCompare(b.label));
await writeFile('tina/editor-options.json',JSON.stringify({
 authors:options(authors.map(x=>({label:x.name,value:x.slug}))),categories:options(categories.map(x=>({label:x.name,value:x.slug}))),
 services:options(services.map(x=>({label:x.title,value:`/services/${x.slug}/`}))),
 content:options([...posts.filter(x=>!x.draft).map(x=>({label:x.title,value:x.route})),...clients.map(x=>({label:x.name,value:x.route}))])
},null,2)+'\n');
