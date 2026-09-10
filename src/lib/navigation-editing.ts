import {tinaField} from '@tinacms/astro/tina-field';
import {navigationLabelKeys} from '../data/navigation';
export function navigationItem(settings:any,services:any[],href:string,fallback:string) {
 const key=navigationLabelKeys[href];
 const service=services.find(item=>`/services/${item.slug}/`===href);
 if(service&&!settings.navigation[key]?.trim())return {label:service.title,field:tinaField(service,'title')};
 return {label:settings.navigation[key]||fallback,field:tinaField(settings.navigation,key)};
}
