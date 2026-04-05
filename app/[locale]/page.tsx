import { setRequestLocale } from "next-intl/server";
import { LoaderGallery } from "@/components/loaders/loader-gallery";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoaderGallery />;
}
