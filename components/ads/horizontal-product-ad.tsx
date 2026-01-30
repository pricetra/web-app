import Script from "next/script";

export type HorizontalProductAdProps = {
  id?: string | number;
};

export const horizontalProductAdScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9688831646501290"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-6t+ed+2i-1n-4w"
     data-ad-client="ca-pub-9688831646501290"
     data-ad-slot="8982980246"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

export default function HorizontalProductAd({ id }: HorizontalProductAdProps) {
  return (
    <div className="bg-gray-50 relative" style={{ width: 250, minHeight: 260 }}>
      <Script
        id={`horizontal-product-ad${id}`}
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: horizontalProductAdScript,
        }}
      />
    </div>
  );
}
