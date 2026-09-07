import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageSeo {
  title: string;
  description: string;
  /** Portal and Admin routes set this so they are never indexed. */
  noIndex?: boolean;
}

const SITE_NAME = 'BlueRise Workforce';

/**
 * Applies per-route document metadata.
 *
 * Centralised so that title format, OpenGraph tags, canonical URL, and robots directives
 * stay consistent, and so a new route cannot ship without them by forgetting a step.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: PageSeo): void {
    const fullTitle = seo.title.includes(SITE_NAME)
      ? seo.title
      : `${seo.title} | ${SITE_NAME}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: seo.description });

    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    this.meta.updateTag({
      name: 'robots',
      content: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
    });

    this.setCanonical();
  }

  private setCanonical(): void {
    const href = this.document.location.origin + this.document.location.pathname;
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
    this.meta.updateTag({ property: 'og:url', content: href });
  }
}
