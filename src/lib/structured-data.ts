export type Breadcrumb = {name:string;path:string};
type RecordData = Record<string,any>;
export function absoluteUrl(value:string,origin:string):string {
 const url=new URL(value,origin);
 if(!['https:','http:'].includes(url.protocol)) throw new Error('Unsupported public URL');
 return url.href;
}
export function serializeJsonLd(value:unknown):string {
 return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
export function buildStructuredData({origin,path,title,description,image,organization,email,business,kind,record={},author,breadcrumbs=[]}: {
 origin:string;path:string;title:string;description:string;image:string;organization:string;email:string;business:RecordData;
 kind?:'service'|'article'|'report'|'page';record?:RecordData;author?:{name:string;route:string};breadcrumbs?:Breadcrumb[];
}) {
 const url=absoluteUrl(path,origin), home=absoluteUrl('/',origin);
 const orgId=home+'#organization',siteId=home+'#website',pageId=url+'#webpage';
 const graph:RecordData[]=[
  {'@type':'Organization','@id':orgId,name:organization,url:home,description:business.description,logo:absoluteUrl(business.logo,origin),email,...(business.sameAs?.length?{sameAs:business.sameAs}:{})},
  {'@type':'WebSite','@id':siteId,url:home,name:organization,publisher:{'@id':orgId}},
  {'@type':'WebPage','@id':pageId,url,name:title,description,isPartOf:{'@id':siteId},...(image?{primaryImageOfPage:{'@type':'ImageObject',url:absoluteUrl(image,origin)}}:{})},
 ];
 if(breadcrumbs.length>=2){
  graph[2].breadcrumb={'@id':url+'#breadcrumb'};
  graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:breadcrumbs.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absoluteUrl(item.path,origin)}))});
 }
 if(kind==='service'){
  graph[2].mainEntity={'@id':url+'#service'};
  graph.push({'@type':'Service','@id':url+'#service',name:record.title||title,description:record.summary||description,url,provider:{'@id':orgId},mainEntityOfPage:{'@id':pageId}});
 }
 if((kind==='article'||kind==='report')&&!record.draft){
  const entity:RecordData={'@type':kind==='report'?'DigitalDocument':'BlogPosting','@id':url+'#content',headline:record.title||title,name:record.title||title,description:record.excerpt||description,url,mainEntityOfPage:{'@id':pageId},publisher:{'@id':orgId},...(image?{image:[absoluteUrl(image,origin)]}:{})};
  if(author) entity.author={'@type':'Person',name:author.name,url:absoluteUrl(author.route,origin)};
  for(const [input,output] of [['publishedDate','datePublished'],['updatedDate','dateModified']]){
   if(record[input]){const date=new Date(record[input]);if(!Number.isNaN(date.valueOf()))entity[output]=date.toISOString();}
  }
  if(kind==='report'&&record.resource?.url) entity.encoding={'@type':'MediaObject',contentUrl:absoluteUrl(record.resource.url,origin),encodingFormat:'application/pdf'};
  graph[2].mainEntity={'@id':entity['@id']};graph.push(entity);
 }
 return {'@context':'https://schema.org','@graph':graph};
}
