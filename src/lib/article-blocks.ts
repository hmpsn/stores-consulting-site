import {z} from 'astro/zod';
import {videoEmbed} from './video-url';
export {videoEmbed} from './video-url';
export const articleBlocks=z.array(z.discriminatedUnion('_template',[
 z.object({_template:z.literal('text'),text:z.string().min(1)}),
 z.object({_template:z.literal('image'),image:z.string().regex(/^(\/(?!\/)|https:\/\/)/),alt:z.string().min(1),width:z.number().int().positive(),height:z.number().int().positive(),caption:z.string().nullish()}),
 z.object({_template:z.literal('video'),title:z.string().min(1),url:z.string().refine(value=>Boolean(videoEmbed(value)),'Use a valid HTTPS YouTube or Vimeo video URL')}),
 z.object({_template:z.literal('link'),label:z.string().min(1),url:z.string().regex(/^(\/(?!\/)|https:\/\/)/)})
])).nullish();
