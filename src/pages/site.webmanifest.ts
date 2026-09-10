import {getGlobalSettings} from '../lib/tina-extended-data';
export async function GET(){
 const settings=await getGlobalSettings();
 return new Response(JSON.stringify({id:'/',name:settings.footer.organization,short_name:'the Stores',start_url:'/',scope:'/',display:'browser',background_color:'#ffffff',theme_color:'#ffffff',icons:[192,512].map(size=>({src:`/assets/brand/icon-${size}.png?v=white-20260910`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))}),{headers:{'Content-Type':'application/manifest+json'}});
}
