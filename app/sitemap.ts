import { MetadataRoute } from 'next'

const URL = 'https://pricetra.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${URL}/home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${URL}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${URL}/stores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // TODO: query all stores instead... paginatorInput: {limit: 1000, page: 1}
    {
      url: `${URL}/stores?page=2`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // {
    //   url: `${URL}/categories`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
    // {
    //   url: `${URL}/brands`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
  ]
}
