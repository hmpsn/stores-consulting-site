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
