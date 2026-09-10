import editorOptions from './editor-options.json';
import type { Collection, TinaField } from 'tinacms';

export const marketingCollections: Collection[] = [
  {
    "name": "aboutPage",
    "label": "About page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "about"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "Over 50 retailers since 2009.",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "More than half have engaged us on more than one project. T",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "groups",
        "label": "Groups",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "tier",
            "label": "Tier",
            "type": "string",
            "required": true,
            "ui": {
              "component": null
            }
          },
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          }
        ]
      }
    ]
  },
  {
    "name": "approachPage",
    "label": "Approach page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "approach"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "Not sure which path fits?",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "That's exactly what the first conversation is for. Tell us",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text7",
            "label": "Path One",
            "type": "string",
            "required": true
          },
          {
            "name": "text8",
            "label": "The Lighthouse Path",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "You've deployed the AI. Some stores are already acting on ",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text10",
            "label": "Path Two",
            "type": "string",
            "required": true
          },
          {
            "name": "text11",
            "label": "The Foundations Path",
            "type": "string",
            "required": true
          },
          {
            "name": "text12",
            "label": "No store has cracked it yet — technology aside. We build t",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text13",
            "label": "Path One · The Lighthouse Path",
            "type": "string",
            "required": true
          },
          {
            "name": "text14",
            "label": "The 72-Hour Diagnostic.",
            "type": "string",
            "required": true
          },
          {
            "name": "text15",
            "label": "For retailers with the technology already live. Fast, deci",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text16",
            "label": "Five critical questions frame the diagnostic: accountabili",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text17",
            "label": "The Lighthouse Cascade",
            "type": "string",
            "required": true
          },
          {
            "name": "text18",
            "label": "Capability moves store to store.",
            "type": "string",
            "required": true
          },
          {
            "name": "text19",
            "label": "Identify your Lighthouses",
            "type": "string",
            "required": true
          },
          {
            "name": "text20",
            "label": "Elevate elite stores into teaching hubs. They transfer gro",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text21",
            "label": "Stop top-down mandates",
            "type": "string",
            "required": true
          },
          {
            "name": "text22",
            "label": "District mandates create compliance. Peer mentorship creat",
            "type": "string",
            "required": true
          },
          {
            "name": "text23",
            "label": "Build the cascade",
            "type": "string",
            "required": true
          },
          {
            "name": "text24",
            "label": "Performance-driven mentorship from Lighthouses to apprenti",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text25",
            "label": "Graduate and repeat",
            "type": "string",
            "required": true
          },
          {
            "name": "text26",
            "label": "Apprentices become Lighthouses. The network grows. Field s",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text27",
            "label": "Path Two · The Foundations Path",
            "type": "string",
            "required": true
          },
          {
            "name": "text28",
            "label": "Assessment. Model Store. Learning Centers. Fleet.",
            "type": "string",
            "required": true
          },
          {
            "name": "text29",
            "label": "For retailers where no store has proven the standard yet —",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text30",
            "label": "Not every engagement needs every stage. We scope to where ",
            "type": "string",
            "required": true
          }
        ]
      },
      {
        "name": "lighthouse",
        "label": "Lighthouse",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "description",
            "label": "Description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "foundations",
        "label": "Foundations",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "description",
            "label": "Description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "resultsPage",
    "label": "Results page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "results"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true
          },
          {
            "name": "eyebrow3",
            "label": "Proof, Not Promises",
            "type": "string",
            "required": true
          },
          {
            "name": "title4",
            "label": "We measure results the way your finance team would.",
            "type": "string",
            "required": true
          },
          {
            "name": "description5",
            "label": "Every range on this page reflects what's actually been del",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title6",
            "label": "These ranges reflect decades of engagements.",
            "type": "string",
            "required": true
          },
          {
            "name": "description7",
            "label": "Yours starts with a diagnostic, not a number pulled from a",
            "type": "string",
            "required": true
          },
          {
            "name": "text8",
            "label": "Typical Results",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "Delivering consistent, proven results that impact the bott",
            "type": "string",
            "required": true
          },
          {
            "name": "text10",
            "label": "Every engagement is scoped to the specific gap in front of",
            "type": "string",
            "required": true
          },
          {
            "name": "text11",
            "label": "How We Guard Against Overstating It",
            "type": "string",
            "required": true
          },
          {
            "name": "text12",
            "label": "Ranges, not best-case numbers",
            "type": "string",
            "required": true
          },
          {
            "name": "text13",
            "label": "Every figure on this page is a range pulled from actual en",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text14",
            "label": "Scoped to the real gap, every time",
            "type": "string",
            "required": true
          },
          {
            "name": "text15",
            "label": "A diagnostic determines which of these drivers actually ap",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      },
      {
        "name": "resultGroups",
        "label": "Result Groups",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "string",
            "required": true
          },
          {
            "name": "items",
            "label": "Items",
            "type": "string",
            "required": true,
            "list": true
          }
        ]
      }
    ]
  },
  {
    "name": "clientsPage",
    "label": "Clients page",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "clients"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title5",
            "label": "$12B in profit created, across every kind of store there i",
            "type": "string",
            "required": true
          },
          {
            "name": "description6",
            "label": "That's not luck. That's a portable standard.",
            "type": "string",
            "required": true
          },
          {
            "name": "text7",
            "label": "A sample, not a roster — dozens more across grocery, speci",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "text8",
            "label": "Client directory eyebrow",
            "type": "string",
            "required": true
          },
          {
            "name": "text9",
            "label": "Client directory heading",
            "type": "string",
            "required": true
          },
          {
            "name": "text10",
            "label": "Client directory introduction",
            "type": "string",
            "required": true
          }
        ]
      },
      {
        "name": "logos",
        "label": "Logos",
        "type": "object",
        "required": true,
        "list": true,
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": "string",
            "required": true
          },
          {
            "name": "href",
            "label": "Href",
            "type": "string",
            "required": true
          },
          {
            "name": "image",
            "label": "Image",
            "type": "object",
            "required": true,
            "fields": [
              {
                "name": "src",
                "label": "Src",
                "type": "image",
                "required": true
              },
              {
                "name": "alt",
                "label": "Alt",
                "type": "string",
                "required": true
              },
              {
                "name": "width",
                "label": "Width",
                "type": "number",
                "required": true
              },
              {
                "name": "height",
                "label": "Height",
                "type": "number",
                "required": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "blogPage",
    "label": "Blog index",
    "path": "src/content/marketing",
    "format": "yaml",
    "match": {
      "include": "blog"
    },
    "yamlMaxLineWidth": -1,
    "ui": {
      "allowedActions": {
        "create": false,
        "delete": false
      },
      "filename": {
        "readonly": true
      }
    },
    "fields": [
      {
        "name": "copy",
        "label": "Page copy",
        "type": "object",
        "required": true,
        "fields": [
          {
            "name": "title1",
            "label": "Search title",
            "type": "string",
            "required": true
          },
          {
            "name": "description2",
            "label": "Search description",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          },
          {
            "name": "title3",
            "label": "Page heading",
            "type": "string",
            "required": true
          },
          {
            "name": "description4",
            "label": "Page introduction",
            "type": "string",
            "required": true,
            "ui": {
              "component": "textarea"
            }
          }
        ]
      }
    ]
  }
];

marketingCollections.forEach((collection) => { const name = collection.name.replace(/Page$/, ''); collection.ui!.router = () => '/' + (name === 'blog' ? 'tscg-blog' : name) + '/'; });

const hidden = (name: string, type: 'string' | 'number' = 'string'): TinaField => (type === 'number' ? {name,type:'number',searchable:false,ui:{component:null}} : {name,type:'string',searchable:false,ui:{component:null}});
const text = (name: string, label: string, required = true) => ({name, label, type: 'string' as const, required, ui:{validate:(value:unknown)=>required&&!String(value||'').trim()?`${label} is required.`:undefined}});
const body: TinaField = {name: 'body', label: 'Body (Markdown)', type: 'string', isBody: true, ui: {component: 'textarea'}, description: 'Edit text and Markdown links. Preserve existing image and video markup; use the image fields for new featured images.'};
const slugify = (value: unknown) => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const existing = {allowedActions: {create: false, delete: false}, filename: {readonly: true}};
const newRecord = (kind: 'post' | 'client' | 'person'): NonNullable<Collection['ui']> => ({
 allowedActions: {create: true, delete: false},
 filename: {readonly: true, slugify: (values) => slugify(values.title || values.name)},
 beforeSubmit: async ({values: rawValues, form}) => {
   const values = rawValues as Record<string, any>;
   // Existing routes always win; derive new routes once from the generated filename.
   const filename = String(form.relativePath || '').split('/').pop()?.replace(/\.md$/, '');
   const slug = values.slug || filename || slugify(values.title || values.name);
   if (!slug) throw new Error('A title or name is required.');
   if (kind === 'post' && !values.draft) {
     if (!String(values.body || '').trim()) throw new Error('Add post content before publishing, or leave Draft enabled.');
     if (!values.categories?.length) throw new Error('Choose at least one category.');
     if (values.contentType === 'report' && (!values.resource?.title || !/^(https:\/\/|\/).*\.pdf(?:[?#].*)?$/i.test(values.resource?.url || ''))) throw new Error('Add a report title and valid PDF URL before publishing.');
   }
   if (kind === 'client' && values.caseStudy?.published && (!values.caseStudy.challenge?.trim() || !values.caseStudy.work?.trim() || !values.caseStudy.results?.trim() || !values.caseStudy.services?.length)) throw new Error('Complete the challenge, work, approved results, and related service before publishing the case study.');
   if (kind === 'person') return {...values, order: values.order || Date.now()};
   return {...values, slug, route: values.route || (kind === 'post' ? `/${slug}/` : `/project/${slug}/`), updatedDate: new Date().toISOString(), ...(kind === 'post' ? {canonicalUrl: values.canonicalUrl || `https://storesconsulting.com/${slug}/`} : {})};
 },
});
export const editorialCollections: Collection[] = [
 {name:'person',label:'People & bios',path:'src/content/people',format:'md',ui:{...newRecord('person'),router:()=>'/about/'},defaultItem:{tier:'senior-consultant',order:999,image:null,alt:''},fields:[
 {...text('name','Name'),isTitle:true},text('role','Role'),{name:'tier',label:'Team group',type:'string',required:true,options:['leadership','director','managing-consultant','senior-consultant']},hidden('order','number'),{name:'image',type:'image',label:'Portrait'},text('alt','Portrait alternative text',false),body,
 ]},
 {name:'post',label:'Blog posts',path:'src/content/posts',format:'md',ui:{...newRecord('post'),router:({document}:any)=>(document.draft || (editorOptions.drafts as string[]).includes(document._sys.filename)) ? undefined : document.route || (editorOptions.routes.post as Record<string,string>)[document._sys.filename] || `/${document._sys.filename}/`},defaultItem:()=>({draft:true,contentType:'article',author:'admin',categories:['uncategorized'],publishedDate:new Date().toISOString(),updatedDate:new Date().toISOString()}),fields:[
 {...text('title','Title'),isTitle:true},hidden('slug'),hidden('route'),{...text('excerpt','Excerpt'),ui:{component:'textarea'}},{name:'publishedDate',type:'datetime',label:'Published date',required:true},{name:'updatedDate',type:'datetime',ui:{component:null}},{...text('author','Author'),options:editorOptions.authors},{name:'categories',label:'Categories',type:'string',list:true,required:true,options:editorOptions.categories},{name:'featuredMedia',type:'image',label:'Featured image'},text('featuredAlt','Featured image alternative text',false),{name:'featuredWidth',label:'Image width',type:'number'},{name:'featuredHeight',label:'Image height',type:'number'},hidden('canonicalUrl'),{name:'draft',label:'Draft (not public)',description:'Leave on while preparing a post. Turn off and Save to publish after the build succeeds.',type:'boolean',required:true},hidden('sourceId','number'),
 {name:'contentType',label:'Post format',type:'string',options:[{value:'article',label:'Written article'},{value:'video',label:'Video'},{value:'report',label:'PDF report'}]},
 {name:'relatedServices',label:'Related services',type:'string',list:true,options:editorOptions.services,description:'Choose the services readers should explore next.'},
 {name:'resource',label:'PDF report',type:'object',description:'For report posts, provide the PDF file URL and its display title.',fields:[text('title','Report title'),text('url','PDF file URL')]},body,
 ]},
 {name:'clientProfile',label:'Client profiles',path:'src/content/clients',format:'md',ui:{...newRecord('client'),router:({document}:any)=>document.route || (editorOptions.routes.clientProfile as Record<string,string>)[document._sys.filename] || `/project/${document._sys.filename}/`},defaultItem:()=>({category:'clients',tier:'unspecified',updatedDate:new Date().toISOString()}),fields:[
 {...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),hidden('category'),{name:'tier',label:'Tier',type:'string',options:['national','regional','unspecified'],required:true},{name:'logo',type:'image',label:'Logo'},{name:'logoWidth',label:'Logo width',type:'number'},{name:'logoHeight',label:'Logo height',type:'number'},hidden('legacyUrl'),{name:'updatedDate',type:'datetime',ui:{component:null}},hidden('sourceId','number'),
 {name:'caseStudy',label:'Case study',type:'object',description:'Prepare approved engagement details here. Existing profile content stays visible until you publish this case study.',fields:[
 {name:'published',label:'Publish approved case study',type:'boolean',description:'Enable only after the client name and results are approved for public use.'},
 {...text('challenge','The challenge',false),ui:{component:'textarea'}},{...text('work','What we did',false),ui:{component:'textarea'}},{...text('results','Approved results',false),ui:{component:'textarea'}},
 {name:'services',label:'Related services',type:'string',list:true,options:editorOptions.services}
 ]},body,
 ]},
 {name:'legacyPage',label:'Additional pages',match:{exclude:'{11-about,13-contact-us,159-services,26774-homepage-1,27300-clients,28431-tscg-blog}'},path:'src/content/legacy-pages',format:'md',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.legacyPage as Record<string,string>)[document._sys.filename]},fields:[
 {...text('title','Title'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description'),ui:{component:'textarea'}},hidden('originalUrl'),{name:'updatedDate',type:'datetime',ui:{component:null}},hidden('sourceId','number'),hidden('overlapStrategy'),body,
 ]},
 {name:'category',label:'Blog categories',path:'src/content/categories',format:'yaml',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.category as Record<string,string>)[document._sys.filename]},fields:[{...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description',false),ui:{component:'textarea'}},hidden('count','number'),hidden('sourceId','number')]},
 {name:'author',label:'Blog authors',path:'src/content/authors',format:'yaml',ui:{...existing,router:({document}:any)=>document.route || (editorOptions.routes.author as Record<string,string>)[document._sys.filename]},fields:[{...text('name','Name'),isTitle:true},hidden('slug'),hidden('route'),{...text('description','Description',false),ui:{component:'textarea'}},{name:'avatar',label:'Avatar',type:'image'},hidden('sourceId','number')]},
];

export const globalCollection: Collection = {
  "name": "globalSettings",
  "label": "Navigation, footer & default CTA",
  "path": "src/content/settings",
  "format": "yaml",
  "match": {
    "include": "global"
  },
  "yamlMaxLineWidth": -1,
  "ui": {
    "allowedActions": {
      "create": false,
      "delete": false
    },
    "filename": {
      "readonly": true
    }
  },
  "fields": [
    {
      "name": "navigation",
      "label": "Navigation",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "services",
          "label": "Services",
          "type": "string",
          "required": true
        },
        {
          "name": "servicesOverview",
          "label": "Services Overview",
          "type": "string",
          "required": true
        },
        {
          "name": "shrink",
          "label": "Shrink",
          "type": "string",
          "required": true
        },
        {
          "name": "fresh",
          "label": "Fresh",
          "type": "string",
          "required": true
        },
        {
          "name": "workforce",
          "label": "Workforce",
          "type": "string",
          "required": true
        },
        {
          "name": "technology",
          "label": "Technology",
          "type": "string",
          "required": true
        },
        {
          "name": "approach",
          "label": "Approach",
          "type": "string",
          "required": true
        },
        {
          "name": "results",
          "label": "Results",
          "type": "string",
          "required": true
        },
        {
          "name": "about",
          "label": "About",
          "type": "string",
          "required": true
        },
        {
          "name": "clients",
          "label": "Clients",
          "type": "string",
          "required": true
        },
        {
          "name": "blog",
          "label": "Blog",
          "type": "string",
          "required": true
        },
        {
          "name": "contact",
          "label": "Contact",
          "type": "string",
          "required": true
        },
        {
          "name": "contactAction",
          "label": "Contact Action",
          "type": "string",
          "required": true
        },
        {
          "name": "menu",
          "label": "Menu",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "name": "footer",
      "label": "Footer",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "services",
          "label": "Services",
          "type": "string",
          "required": true
        },
        {
          "name": "company",
          "label": "Company",
          "type": "string",
          "required": true
        },
        {
          "name": "explore",
          "label": "Explore",
          "type": "string",
          "required": true
        },
        {
          "name": "organization",
          "label": "Organization",
          "type": "string",
          "required": true
        },
        {
          "name": "location",
          "label": "Location",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "name": "cta",
      "label": "Cta",
      "type": "object",
      "required": true,
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "type": "string",
          "required": true
        },
        {
          "name": "description",
          "label": "Description",
          "type": "string",
          "required": true
        },
        {
          "name": "href",
          "label": "Href",
          "type": "string",
          "required": true
        },
        {
          "name": "label",
          "label": "Label",
          "type": "string",
          "required": true
        }
      ]
    }
  ]
};

function improveListLabels(fields: TinaField[]) {
 for (const field of fields) {
  if (field.type !== 'object' || !field.fields) continue;
  if (field.list) field.ui = {...field.ui, itemProps:(item)=>({label:item?.name || item?.title || 'Item'})};
  if (field.name === 'groups') field.ui = {...field.ui, validate:(value: unknown)=>Array.isArray(value) && value.length===4 ? undefined : 'Keep the four existing team groups.'};
  improveListLabels(field.fields);
 }
}
marketingCollections.forEach(collection=>{if(collection.fields)improveListLabels(collection.fields)});
