import {z} from 'astro/zod';
const image=z.string().refine(value=>value===''||/^\/(?!\/)/.test(value)||/^https:\/\//.test(value),'Use a site path or HTTPS image URL');
export const sharingSchema=z.object({image:image.nullish(),alt:z.string().nullish()}).nullish();
export const businessSchema=z.object({description:z.string().min(1),logo:image.refine(value=>value.length>0,'Choose a logo'),sameAs:z.array(z.url().refine(value=>value.startsWith('https://'),'Use HTTPS')).nullish()});
