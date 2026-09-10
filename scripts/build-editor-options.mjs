import {readdir,readFile,writeFile} from 'node:fs/promises';
import {parse} from 'yaml';
async function records(group) {
 return Promise.all((await readdir(`src/content/${group}`)).filter(f=>/\.(md|yaml)$/.test(f)).sort().map(async f=>{const raw=await readFile(`src/content/${group}/${f}`,'utf8');return {...parse(f.endsWith('.md')?raw.split(/^---\s*$/m)[1]:raw),_filename:f.replace(/\.(md|yaml)$/,'')};}));
}
const [authors,categories,services,posts,clients,pages]=await Promise.all(['authors','categories','services','posts','clients','legacy-pages'].map(records));
const options=items=>items.sort((a,b)=>a.label.localeCompare(b.label));
await writeFile('tina/editor-options.json',JSON.stringify({
 routes:Object.fromEntries([['post',posts],['clientProfile',clients],['legacyPage',pages],['author',authors],['category',categories]].map(([name,items])=>[name,Object.fromEntries(items.map(x=>[x._filename,x.route]))])),
 drafts:posts.filter(x=>x.draft).map(x=>x._filename),
 authors:options(authors.map(x=>({label:x.name,value:x.slug}))),categories:options(categories.map(x=>({label:x.name,value:x.slug}))),
 services:options(services.map(x=>({label:x.title,value:`/services/${x.slug}/`}))),
 content:options([...posts.filter(x=>!x.draft).map(x=>({label:x.title,value:x.route})),...clients.map(x=>({label:x.name,value:x.route}))])
},null,2)+'\n');
