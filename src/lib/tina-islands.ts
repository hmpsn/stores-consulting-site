import HeaderContent from '../components/editable/HeaderContent.astro';
import FooterContent from '../components/editable/FooterContent.astro';
import CtaContent from '../components/editable/CtaContent.astro';
import {getGlobalSettings} from './tina-extended-data';
import { getMarketingPage, getEditorialPage } from './tina-extended-data';
import EditorialPageContent from '../components/editable/EditorialPageContent.astro';
import AboutPageContent from '../components/editable/AboutPageContent.astro';
import ApproachPageContent from '../components/editable/ApproachPageContent.astro';
import ResultsPageContent from '../components/editable/ResultsPageContent.astro';
import ClientsPageContent from '../components/editable/ClientsPageContent.astro';
import BlogPageContent from '../components/editable/BlogPageContent.astro';
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type {
  ContactPageQuery,
  HomepageQuery,
  ServiceQuery,
  ServicesPageQuery,
} from '../../tina/__generated__/types';
import ContactPageContent from '../components/editable/ContactPageContent.astro';
import HomepageContent from '../components/editable/HomepageContent.astro';
import ServicePageContent from '../components/editable/ServicePageContent.astro';
import ServicesIndexContent from '../components/editable/ServicesIndexContent.astro';
import { getContactPage, getHomepage, getService, getServicesPage } from './tina-data';

export const tinaIslands: IslandRegistry = {
  globalHeader: {fetch:()=>getGlobalSettings(),component:HeaderContent,wrapper:{tag:'div',className:'tina-chrome'},propsFromData:(settings,params)=>({settings,activeSection:params.get('activeSection')||undefined,currentPath:params.get('currentPath')})},
  globalFooter: {fetch:()=>getGlobalSettings(),component:FooterContent,wrapper:{tag:'div',className:'tina-chrome'},propsFromData:(settings,params)=>({settings,activeSection:params.get('activeSection')||undefined,currentPath:params.get('currentPath')})},
  globalCta: {fetch:()=>getGlobalSettings(),component:CtaContent,wrapper:{tag:'div'},propsFromData:(_settings,params)=>Object.fromEntries(params)},
  aboutPage: {fetch: () => getMarketingPage('about'), component: AboutPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  approachPage: {fetch: () => getMarketingPage('approach'), component: ApproachPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  resultsPage: {fetch: () => getMarketingPage('results'), component: ResultsPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  clientsPage: {fetch: () => getMarketingPage('clients'), component: ClientsPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  blogPage: {fetch: () => getMarketingPage('blog'), component: BlogPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  post: {fetch: (_request,params) => getEditorialPage('post',params.get('path')||''), component: EditorialPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  clientProfile: {fetch: (_request,params) => getEditorialPage('clientProfile',params.get('path')||''), component: EditorialPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  legacyPage: {fetch: (_request,params) => getEditorialPage('legacyPage',params.get('path')||''), component: EditorialPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  author: {fetch: (_request,params) => getEditorialPage('author',params.get('path')||''), component: EditorialPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},
  category: {fetch: (_request,params) => getEditorialPage('category',params.get('path')||''), component: EditorialPageContent, wrapper: {tag:'div'}, propsFromData: (data) => data as Record<string, unknown>},

  homepage: {
    fetch: () => getHomepage(),
    component: HomepageContent,
    wrapper: { tag: 'div', className: 'home-page' },
    propsFromData: (result) => ({
      data: (result as QueryResult<HomepageQuery>).data.homepage,
    }),
  },
  servicesIndex: {
    fetch: () => getServicesPage(),
    component: ServicesIndexContent,
    wrapper: { tag: 'div', className: 'services-index-page' },
    propsFromData: (result) => ({
      data: (result as QueryResult<ServicesPageQuery>).data.servicesPage,
    }),
  },
  contact: {
    fetch: () => getContactPage(),
    component: ContactPageContent,
    wrapper: { tag: 'div', className: 'contact-page' },
    propsFromData: (result, params) => ({
      data: (result as QueryResult<ContactPageQuery>).data.contactPage,
      status: params.get('status'),
    }),
  },
  service: {
    fetch: (_request, params) => getService(params.get('slug') ?? ''),
    component: ServicePageContent,
    wrapper: { tag: 'div', className: 'service-page' },
    propsFromData: (result) => ({
      data: (result as QueryResult<ServiceQuery>).data.service,
    }),
  },
};
