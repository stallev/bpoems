export interface DynamicPagePathProps {
  params: Promise<{
    slug: string;
  }>;
}
