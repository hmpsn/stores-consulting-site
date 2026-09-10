import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,cp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parse,stringify} from 'yaml';
const workflow=parse(await readFile('.github/workflows/publishing-alert.yml','utf8'));
for(const existing of [false,true])test(`publishing alert ${existing?'updates existing issue':'creates assigned issue'}`,async()=>{
 const calls=[];
 const github={rest:{issues:{listForRepo:async()=>({data:existing?[{title:'Website publishing needs attention',number:7}]:[]}),create:async x=>calls.push(['create',x]),createComment:async x=>calls.push(['comment',x])}}};
 const context={repo:{owner:'hmpsn',repo:'stores-consulting-site'},payload:{deployment:{sha:'abc123',url:'https://api.github.com/deployments/1'},deployment_status:{log_url:'https://vercel.com/deployment/1'}}};
 const run=new Function('github','context',`return (async()=>{${workflow.jobs.notify.steps[0].with.script}})()`);
 await run(github,context);assert.equal(calls.length,1);assert.equal(calls[0][0],existing?'comment':'create');assert.match(calls[0][1].body,/abc123/);if(!existing)assert.deepEqual(calls[0][1].assignees,['hmpsn']);
});
test('draft case studies can be incomplete; published studies and links must be valid',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'stores-content-'));
 try{
  await cp('src/content',path.join(dir,'src/content'),{recursive:true});await cp('public',path.join(dir,'public'),{recursive:true});
  const file=path.join(dir,'src/content/clients/28055-99-cent-only.md');const raw=await readFile(file,'utf8');
  const setCase=async value=>writeFile(file,raw.replace('\n---\n','\n'+stringify({caseStudy:value})+'---\n'));
  const check=()=>spawnSync(process.execPath,[path.resolve('scripts/check-editor-content.mjs')],{cwd:dir,encoding:'utf8'});
  await setCase({published:true});assert.notEqual(check().status,0);
  await setCase({published:false});assert.equal(check().status,0);
  await setCase({published:true,challenge:'Approved challenge',work:'Approved work',results:'Approved result',services:['/services/shrink-profit-recovery/']});assert.equal(check().status,0);
  await setCase({published:true,challenge:'Approved challenge',work:'Approved work',results:'Approved result',services:['/missing/']});assert.notEqual(check().status,0);
 }finally{await rm(dir,{recursive:true,force:true});}
});
