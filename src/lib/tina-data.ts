import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

export const getHomepage = () =>
  requestWithMetadata(client.queries.homepage({ relativePath: 'home.yaml' }), { priority: 'primary' });

export const getServicesPage = () =>
  requestWithMetadata(client.queries.servicesPage({ relativePath: 'services.yaml' }), { priority: 'primary' });

export const getContactPage = () =>
  requestWithMetadata(client.queries.contactPage({ relativePath: 'contact.yaml' }), { priority: 'primary' });

export const getService = (slug: string) =>
  requestWithMetadata(client.queries.service({ relativePath: `${slug}.yaml` }), { priority: 'primary' });
