import { createCloudinaryUrl } from "@/lib/files";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import {
  AllStoresDocument,
  AllStoresQuery,
  AllStoresQueryVariables,
  CategorySearchDocument,
  CategorySearchQueryVariables,
  CategorySearchQuery,
  AllBrandsDocument,
  AllBrandsQueryVariables,
  AllBrandsQuery,
} from "graphql-utils";
import { MetadataRoute } from "next";
import { cache } from "react";

const URL = "https://pricetra.com";

const getAllStores = cache(() =>
  fetchGraphql<AllStoresQueryVariables, AllStoresQuery>(
    AllStoresDocument,
    "query",
    {
      paginator: {
        limit: 500,
        page: 1,
      },
    }
  )
);

const getAllCategories = cache(() =>
  fetchGraphql<CategorySearchQueryVariables, CategorySearchQuery>(
    CategorySearchDocument,
    "query",
    {
      search: "",
    }
  )
);

const getAllBrands = cache(() =>
  fetchGraphql<AllBrandsQueryVariables, AllBrandsQuery>(
    AllBrandsDocument,
    "query",
    {}
  )
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: allStoresData } = await getAllStores();
  const stores = allStoresData?.allStores?.stores ?? [];

  const { data: allCategoriesData } = await getAllCategories();
  const categories = allCategoriesData?.categorySearch ?? [];

  const { data: allBrandsData } = await getAllBrands();
  const brands = allBrandsData?.allBrands ?? [];

  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${URL}/home`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${URL}/search`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${URL}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${URL}/stores`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // stores
    ...(stores.map((s) => ({
      url: `${URL}/stores/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
      images: [createCloudinaryUrl(s.logo)],
    })) as MetadataRoute.Sitemap),

    // categories
    ...(categories.map((c) => ({
      url: `${URL}/search?categoryId=${c.id}&amp;category=${encodeURIComponent(
        c.name
      )}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    })) as MetadataRoute.Sitemap),

    // brands
    ...(brands.map((b) => ({
      url: `${URL}/search?brand=${encodeURIComponent(b.brand)}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    })) as MetadataRoute.Sitemap),
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
  ];
}
