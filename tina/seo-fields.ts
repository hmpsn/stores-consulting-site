import type {Collection,TinaField} from 'tinacms';
const imageField:TinaField={name:'image',label:'Sharing image',type:'image',description:'Optional. Use a landscape image, ideally 1200 × 630. Leave blank to use the article featured image or site default.'};
export const sharingFields:TinaField[]=[imageField,{name:'alt',label:'Sharing image description',type:'string',description:'Describe the selected image. Used by social previews.'}];
export const businessFields:TinaField[]=[
 {name:'description',label:'Business description',type:'string',required:true,ui:{component:'textarea'},description:'A factual summary consistent with the public website. Name comes from Footer → Organization; email comes from Contact page.'},
 {name:'logo',label:'Organization logo',type:'image',required:true,description:'Logo for search engines. This does not replace the header artwork or browser icons.'},
 {name:'sameAs',label:'Official profile URLs',type:'string',list:true,description:'Only verified company profiles, such as the company LinkedIn page. Leave empty if unknown.',ui:{validate:(value:any)=>!value||(Array.isArray(value)?value:[value]).every((item:string)=>{try{return new URL(item).protocol==='https:';}catch{return false;}})?undefined:'Use complete HTTPS profile URLs.'}}
];
export function withSharing(collection:Collection):Collection {
 if(!collection.fields || ['globalSettings','person'].includes(collection.name)) return collection;
 return {...collection,templates:undefined,fields:[...(collection.fields||[]),{name:'seo',label:'Social sharing',type:'object',fields:sharingFields}]};
}
