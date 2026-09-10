export function videoEmbed(value:string):string|undefined {
 try {
  const url=new URL(value);if(url.protocol!=='https:')return;
  const host=url.hostname;
  if(['youtube.com','www.youtube.com','www.youtube-nocookie.com','youtu.be'].includes(host)){
   const id=host==='youtu.be'?url.pathname.slice(1):url.searchParams.get('v')||url.pathname.split('/').filter(Boolean).at(-1);
   if(id&&/^[a-zA-Z0-9_-]{11}$/.test(id))return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){
   const id=url.pathname.split('/').filter(Boolean).at(-1);if(id&&/^\d+$/.test(id))return `https://player.vimeo.com/video/${id}`;
  }
 }catch{}
}
