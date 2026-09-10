import editorOptions from './editor-options.json';
import { defineConfig, type TinaField } from 'tinacms';
import { marketingCollections, editorialCollections, globalCollection } from './extended-schema';

const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';
const clientId = process.env.TINA_PUBLIC_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;

const hiddenString = (name: string): TinaField => ({
  type: 'string',
  name,
  searchable: false,
  ui: { component: null },
});

const actionFields: TinaField[] = [
  { type: 'string', name: 'label', label: 'Button label', required: true },
  { type: 'string', name: 'href', label: 'Button URL', required: true },
];

const imageFields: TinaField[] = [
  { type: 'image', name: 'src', label: 'Image', required: true },
  {
    type: 'string',
    name: 'alt',
    label: 'Alternative text',
    description: 'Describe what is visibly present. Do not add marketing claims.',
    required: true,
  },
  { type: 'number', name: 'width', label: 'Intrinsic width', required: true },
  { type: 'number', name: 'height', label: 'Intrinsic height', required: true },
  {
    type: 'string',
    name: 'position',
    label: 'Crop position',
    options: [
      { label: 'Center', value: 'center' },
      { label: 'Top', value: 'top' },
      { label: 'Bottom', value: 'bottom' },
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
    ],
  },
];

const metadataFields: TinaField[] = [
  { type: 'string', name: 'title', label: 'Page title', required: true },
  {
    type: 'string',
    name: 'description',
    label: 'Search description',
    required: true,
    ui: { component: 'textarea' },
  },
];

export default defineConfig({
  branch,
  clientId,
  token: process.env.TINA_TOKEN,
  search: {
    tina: { indexerToken: process.env.TINA_SEARCH_TOKEN || '', stopwordLanguages: ['eng'] },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 10000,
  },
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'assets/editorial',
      static: false,
    },
    accept: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
  },
  schema: {
    collections: [
      ...marketingCollections,
      ...editorialCollections,
      globalCollection,
      {
        name: 'homepage',
        label: 'Homepage',
        path: 'src/content/site-pages',
        format: 'yaml',
        match: { include: 'home' },
        yamlMaxLineWidth: -1,
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true },
          router: () => '/',
        },
        fields: [
          hiddenString('pageType'),
          { type: 'object', name: 'metadata', label: 'Metadata', fields: metadataFields },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'headline', label: 'Headline', required: true },
              { type: 'string', name: 'emphasis', label: 'Emphasized ending', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              { type: 'object', name: 'primaryAction', label: 'Primary action', fields: actionFields },
              { type: 'object', name: 'secondaryAction', label: 'Secondary action', fields: actionFields },
              { type: 'object', name: 'image', label: 'Hero image', fields: imageFields },
            ],
          },
          {
            type: 'object',
            name: 'problem',
            label: 'Execution gaps',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'cards',
                label: 'Gap cards',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || 'Gap card' }) },
                fields: [
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'copy', label: 'Copy', required: true, ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'ratio',
            label: 'Execution ratio',
            fields: [
              {
                type: 'object',
                name: 'items',
                label: 'Ratio metrics',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || 'Ratio metric' }) },
                fields: [
                  { type: 'string', name: 'value', label: 'Value', required: true },
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'string', name: 'copy', label: 'Copy', required: true, ui: { component: 'textarea' } },
                ],
              },
              { type: 'string', name: 'quote', label: 'Quote', required: true, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'proof',
            label: 'Evidence section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Orientation label', required: true },
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'paragraphs', label: 'Paragraphs', list: true, required: true, ui: { component: 'textarea' } },
              { type: 'object', name: 'action', label: 'Action', fields: actionFields },
              { type: 'object', name: 'image', label: 'Evidence image', fields: imageFields },
              {
                type: 'object',
                name: 'outcomes',
                label: 'Engagement outcomes',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || 'Outcome' }) },
                fields: [
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'string', name: 'value', label: 'Value', required: true },
                ],
              },
              { type: 'string', name: 'totalLabel', label: 'Total label', required: true },
              { type: 'string', name: 'totalValue', label: 'Total value', required: true },
            ],
          },
          {
            type: 'object',
            name: 'servicesIntro',
            label: 'Services introduction',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'approach',
            label: 'Approach section',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              { type: 'object', name: 'action', label: 'Action', fields: actionFields },
              {
                type: 'object',
                name: 'steps',
                label: 'Steps',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title || 'Step' }) },
                fields: [
                  { type: 'string', name: 'number', label: 'Number', required: true },
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'copy', label: 'Copy', required: true, ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'technology',
            label: 'Technology philosophy',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Orientation label', required: true },
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              { type: 'string', name: 'pills', label: 'Principles', list: true, required: true },
            ],
          },
          {
            type: 'object',
            name: 'teamProof',
            label: 'Team proof',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'metrics',
                label: 'Metrics',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.value || 'Metric' }) },
                fields: [
                  { type: 'string', name: 'value', label: 'Value', required: true },
                  { type: 'string', name: 'label', label: 'Label', required: true },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'servicesPage',
        label: 'Services Index',
        path: 'src/content/site-pages',
        format: 'yaml',
        match: { include: 'services' },
        yamlMaxLineWidth: -1,
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true },
          router: () => '/services/',
        },
        fields: [
          hiddenString('pageType'),
          { type: 'object', name: 'metadata', label: 'Metadata', fields: metadataFields },
          {
            type: 'object',
            name: 'intro',
            label: 'Page introduction',
            fields: [
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
            ],
          },
        ],
      },
      {
        name: 'contactPage',
        label: 'Contact Page',
        path: 'src/content/site-pages',
        format: 'yaml',
        match: { include: 'contact' },
        yamlMaxLineWidth: -1,
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true },
          router: () => '/contact-us/',
        },
        fields: [
{"name":"form","label":"Form labels & messages","type":"object","required":true,"fields":[{"name":"rateLimited","label":"Too many attempts message","type":"string","required":true},{"name":"name","label":"Name","type":"string","required":true},{"name":"email","label":"Email","type":"string","required":true},{"name":"company","label":"Company","type":"string","required":true},{"name":"phone","label":"Phone","type":"string","required":true},{"name":"message","label":"Message","type":"string","required":true},{"name":"submit","label":"Submit","type":"string","required":true},{"name":"sending","label":"Sending","type":"string","required":true},{"name":"success","label":"Success","type":"string","required":true},{"name":"invalid","label":"Invalid","type":"string","required":true},{"name":"unavailable","label":"Unavailable","type":"string","required":true}]},
          hiddenString('pageType'),
          { type: 'object', name: 'metadata', label: 'Metadata', fields: metadataFields },
          {
            type: 'object',
            name: 'intro',
            label: 'Page introduction',
            fields: [
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'details',
            label: 'Contact details',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Orientation label', required: true },
              { type: 'string', name: 'name', label: 'Organization name', required: true },
              { type: 'string', name: 'addressLines', label: 'Address lines', list: true, required: true },
              { type: 'string', name: 'email', label: 'Email', required: true },
            ],
          },
        ],
      },
      {
        name: 'service',
        label: 'Services',
        path: 'src/content/services',
        format: 'yaml',
        yamlMaxLineWidth: -1,
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true },
          router: ({ document }) => `/services/${document._sys.filename}/`,
        },
        fields: [
{type:'string',name:'workstreamsTitle',label:'Workstreams heading',required:true},
{type:'string',name:'resultsTitle',label:'Results heading',required:true},
{type:'string',name:'ctaTitle',label:'Closing heading',required:true},
{type:'string',name:'ctaDescription',label:'Closing description',required:true},
{type:'string',name:'ctaHref',label:'Closing button destination',required:true},
{type:'string',name:'ctaLabel',label:'Closing button label',required:true},

          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          hiddenString('slug'),
          { type: 'number', name: 'order', ui: { component: null } },
          { type: 'string', name: 'eyebrow', label: 'Orientation label', required: true },
          { type: 'string', name: 'summary', label: 'Summary', required: true, ui: { component: 'textarea' } },
          { type: 'string', name: 'thesisLabel', label: 'Thesis label', required: true },
          { type: 'string', name: 'thesis', label: 'Thesis', required: true, ui: { component: 'textarea' } },
          {
            type: 'object',
            name: 'workstreams',
            label: 'Workstreams',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || 'Workstream' }) },
            fields: [
              { type: 'string', name: 'title', label: 'Title', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'metrics',
            label: 'Metrics',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.value || 'Metric' }) },
            fields: [
              { type: 'string', name: 'value', label: 'Value', required: true },
              { type: 'string', name: 'label', label: 'Label', required: true },
            ],
          },
          { type: 'string', name: 'metricsNote', label: 'Metrics note', required: true, ui: { component: 'textarea' } },
          { type: 'string', name: 'relatedPaths', list: true, ui: { component: null } },
          {type:'string',name:'relatedContent',label:'Related articles, reports & clients',list:true,options:editorOptions.content,description:'Select useful evidence for this service. Draft posts are excluded.'},
          { type: 'object', name: 'heroMedia', label: 'Hero image', fields: imageFields },
          { type: 'object', name: 'supportingMedia', label: 'Supporting image', fields: imageFields },
        ],
      },
    ],
  },
});
