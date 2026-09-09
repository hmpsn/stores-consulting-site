import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

// Connection pagination is required: the legacy estate already exceeds default limits.
export async function getEditorialList(collection: 'person' | 'post' | 'clientProfile' | 'author' | 'category') {
  const queryName = `${collection}Connection`;
  const records: any[] = [];
  let after: string | undefined;
  do {
    const result: any = await requestWithMetadata((client.queries as any)[queryName]({first: 100, after}));
    const connection = result.data[queryName];
    records.push(...connection.edges.map((edge: any) => edge?.node).filter(Boolean));
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : undefined;
  } while (after);
  return records;
}
export async function getEditorialDocument(collection: 'person' | 'post' | 'clientProfile' | 'legacyPage' | 'author' | 'category', relativePath: string) {
  if (!/^[a-z0-9][a-z0-9_-]*\.(md|yaml)$/.test(relativePath)) throw new Error('Invalid content path');
  const result: any = await requestWithMetadata((client.queries as any)[collection]({relativePath}), {priority:'primary'});
  return result.data[collection];
}
export async function getBlogData() {
  const [entries, authors, categories] = await Promise.all([getEditorialList('post'),getEditorialList('author'),getEditorialList('category')]);
  const posts = entries.filter(post=>!post.draft).map(post=>({...post,publishedDate:new Date(post.publishedDate)})).sort((a,b)=>b.publishedDate.valueOf()-a.publishedDate.valueOf());
  return {posts,authors,categories};
}
export async function getMarketingPage(name: 'about' | 'approach' | 'results' | 'clients' | 'blog') {
  const queryName = `${name}Page`;
  const result: any = await requestWithMetadata((client.queries as any)[queryName]({relativePath:`${name}.yaml`}), {priority:'primary'});
  const related: any = name === 'about' ? {people:(await getEditorialList('person')).sort((a,b)=>a.order-b.order)} : name === 'clients' ? {clients:(await getEditorialList('clientProfile')).sort((a,b)=>a.name.localeCompare(b.name))} : name === 'blog' ? await getBlogData() : {};
  return {data:result.data[queryName], related};
}
export async function getEditorialPage(collection: 'post' | 'clientProfile' | 'legacyPage' | 'author' | 'category', relativePath: string) {
  const data = await getEditorialDocument(collection, relativePath);
  const related = ['post','author','category'].includes(collection) ? await getBlogData() : {};
  return {data,related,collection};
}

export async function getGlobalSettings() { const result = await requestWithMetadata(client.queries.globalSettings({relativePath:'global.yaml'})); return result.data.globalSettings; }
