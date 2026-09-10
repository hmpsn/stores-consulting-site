import {videoEmbed} from '../src/lib/video-url';
import type {TinaField} from 'tinacms';
const text=(name:string,label:string): {name:string;label:string;type:'string';required:true}=>({name,label,type:'string',required:true});
const safeUrl=(value:unknown)=>typeof value==='string'&&(/^(\/(?!\/)|https:\/\/)/.test(value))?undefined:'Use a site path or an HTTPS URL.';
export const contentBlocks:TinaField={name:'contentBlocks',label:'Article blocks',description:'Optional structured text, images, videos and links below the existing body. Add new media here instead of editing HTML.',type:'object',list:true,templates:[
 {name:'text',label:'Text',fields:[{...text('text','Text (Markdown)'),ui:{component:'textarea'}}]},
 {name:'image',label:'Image',fields:[{name:'image',label:'Image',type:'image',required:true},text('alt','Alternative text'),{name:'width',label:'Image width',type:'number',required:true},{name:'height',label:'Image height',type:'number',required:true},{name:'caption',label:'Caption',type:'string'}]},
 {name:'video',label:'Video',fields:[text('title','Video title'),{...text('url','YouTube or Vimeo URL'),ui:{validate:(value:unknown)=>videoEmbed(String(value))?undefined:'Use a valid HTTPS YouTube or Vimeo video URL.'}}]},
 {name:'link',label:'Link',fields:[text('label','Link text'),{...text('url','Destination'),ui:{validate:safeUrl}}]}
]};
