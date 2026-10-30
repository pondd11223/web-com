import { useEffect } from "react";

interface SEOHeadProps {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
}

export function SEOHead({ title, description, ogImage }: SEOHeadProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    if (ogImage) {
      let metaOg = document.querySelector('meta[property="og:image"]');
      if (!metaOg) {
        metaOg = document.createElement("meta");
        metaOg.setAttribute("property", "og:image");
        document.head.appendChild(metaOg);
      }
      metaOg.setAttribute("content", ogImage);
    }
  }, [title, description, ogImage]);

  return null;
}
